const uuid = require("uuid/v4");
const generate_scenario = require("../utils/generate_scenario");
const send_email = require("../utils/send_email");

const WEEK = 1000 * 60 * 60 * 24 * 7;

const messages = {
	"no-email": "Podaj swój adres email.",
	"email-taken": "Podany adres email jest zajęty.",
	"email-sent":
		"Na Twoją skrzynkę email został wysłany link aktywujący Twoje konto.",
	"email-failed": "Nie udało się wysłać maila, spróbuj ponownie.",
};

module.exports = {
	messages,
	route: function(App, www_server) {
		www_server.custom_route(
			"POST",
			"/api/v1/registration-intent",
			async function(app, context, params) {
				const { e_mail } = params;
				if (!e_mail) {
					return Promise.reject(messages["no-email"]);
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
					return Promise.reject(messages["email-taken"]);
				}
				const intent = await app.run_action(
					new app.Sealious.SuperContext(),
					["collections", "registration-intents"],
					"create",
					{
						e_mail,
						token: uuid(),
						expires_at: Date.now() + WEEK,
					}
				);
				const { nodemailer_config } = App.ConfigManager.get_config();
				//ofc this link is temporary and will be changed
				const link = `/finish-registration&token=${intent.body.token}`;
				const scenario = generate_scenario["email-confirmation"](
					intent,
					link
				);
				try {
					await send_email(nodemailer_config, scenario);
					return messages["email-sent"];
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
						.then(() => messages["email-failed"]);
				}
			}
		);
	},
};
