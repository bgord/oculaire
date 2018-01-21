const uuid = require("uuid/v4");
const generate_scenario = require("../utils/generate_scenario");
const send_email = require("../utils/send_email");

const WEEK = 1000 * 60 * 60 * 24 * 7;

const messages = {
	"no-email": "Podaj swój adres email.",
	"email-invalid": "Podany adres email jest nieprawidłowy.",
	"email-taken": "Podany adres email jest zajęty.",
	"email-failed": "Nie udało się wysłać maila, spróbuj ponownie.",
	"email-sent": "Wysłano link aktywujący na podany adres.",
};

const SEND_ERROR = ValidationError => (reason, additional_info = {}) =>
	Promise.reject(
		new ValidationError({
			type: reason,
			content: messages[reason],
			additional_info,
		})
	);

const RESOLVE = (reason, additional_info = {}) => ({
	type: reason,
	content: messages[reason],
	additional_info,
});

module.exports = {
	messages,
	route: function(App, www_server) {
		www_server.custom_route(
			"POST",
			"/api/v1/registration-intent",
			async function(app, context, params) {
				const { base_url } = App.ConfigManager.get_config("www-server");
				const REJECT = SEND_ERROR(app.Sealious.Errors.ValidationError);
				const { e_mail } = params;
				if (!e_mail) {
					return REJECT("no-email");
				}
				const [users, intents] = await Promise.all([
					app.run_action(
						new app.Sealious.SuperContext(),
						["collections", "users"],
						"show",
						{
							filter: {
								e_mail,
							},
						}
					),
					app.run_action(
						new app.Sealious.SuperContext(),
						["collections", "registration-intents"],
						"show",
						{
							filter: {
								e_mail,
								expires_at: { ">": Date.now() },
							},
						}
					),
				]);
				if (users.length || intents.length) {
					return REJECT("email-taken");
				}
				const intent = await app
					.run_action(
						new app.Sealious.SuperContext(),
						["collections", "registration-intents"],
						"create",
						{
							e_mail,
							token: uuid(),
							expires_at: Date.now() + WEEK,
						}
					)
					.catch(e => REJECT("email-invalid"));
				const { nodemailer_config } = App.ConfigManager.get_config();

				const link = `${base_url}/finish-registration?token=${
					intent.body.token
				}`;
				const scenario = generate_scenario["email-confirmation"](
					intent,
					link
				);
				try {
					await send_email(nodemailer_config, scenario);
					return RESOLVE("email-sent");
				} catch (e) {
					console.log(e);
					console.log(
						"Failed to send. Deleting registration intent..."
					);
					return app
						.run_action(
							new app.Sealious.SuperContext(),
							["collections", "registration-intents", intent.id],
							"delete"
						)
						.then(() => REJECT("email-failed"));
				}
			}
		);
	},
};
