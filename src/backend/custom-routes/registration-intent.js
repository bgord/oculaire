const uuid = require("uuid/v4");
const generate_scenario = require("../utils/generate_scenario");
const send_email = require("../utils/send_email");

const WEEK = 1000 * 60 * 60 * 24 * 7;

const messages = {
	"missing-params": "Nie wszystkie pola zostały podane: ",
	"email-invalid": "Podany adres email jest nieprawidłowy.",
	"email-taken": "Podany adres email jest zajęty.",
	"email-failed": "Nie udało się wysłać maila, spróbuj ponownie.",
	"email-sent": "Wysłano link aktywujący na podany adres.",
};

const {
	SEND_ERROR,
	RESOLVE,
	VALIDATE_PARAMS,
} = require("../utils/custom_routes_utils")(messages);

const expected_params = ["e_mail"];

module.exports = (App, www_server) =>
	www_server.custom_route(
		"POST",
		"/api/v1/registration-intent",
		async (app, context, params) => {
			const { base_url } = App.ConfigManager.get_config("www-server");
			await VALIDATE_PARAMS(expected_params, params);
			const { e_mail } = params;
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
				return SEND_ERROR("email-taken");
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
				.catch(e => SEND_ERROR("email-invalid"));
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
				console.log("Failed to send. Deleting registration intent...");
				return app
					.run_action(
						new app.Sealious.SuperContext(),
						["collections", "registration-intents", intent.id],
						"delete"
					)
					.then(() => SEND_ERROR("email-failed"));
			}
		}
	);
