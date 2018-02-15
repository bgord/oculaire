const uuid = require("uuid/v4");
const generate_scenario = require("../utils/generate_scenario");
const send_email = require("../utils/send_email");

const messages = {
	"missing-params": "Nie wszystkie pola zostały podane: ",
	"invalid-email": "Konto o podanym adresie email nie istnieje!",
	"email-sent": "Wysłano email z linkiem do zmiany hasła.",
	"email-failed": "Nie udało się wysłać emaila, spróbuj później.",
};

const {
	SEND_ERROR,
	RESOLVE,
	VALIDATE_PARAMS,
} = require("../utils/custom_routes_utils")(messages);

const expected_params = ["e_mail"];

const DAY = 1000 * 60 * 60 * 24;

module.exports = (App, www_server) =>
	www_server.custom_route(
		"POST",
		"/api/v1/password-reset-intent",
		async (app, context, params) => {
			const { base_url } = App.ConfigManager.get_config("www-server");
			await VALIDATE_PARAMS(expected_params, params);
			const { e_mail } = params;
			const [user] = await app.run_action(
				new app.Sealious.SuperContext(),
				["collections", "users"],
				"show",
				{
					filter: {
						e_mail,
					},
				}
			);

			if (!user) {
				return SEND_ERROR("invalid-email");
			}

			const token = uuid();
			const password_reset = {
				type: "password-reset",
				token,
				user: user.id,
				expires_at: Date.now() + DAY,
			};
			const intent = await app.run_action(
				new app.Sealious.SuperContext(),
				["collections", "tokens"],
				"create",
				password_reset
			);

			const { nodemailer_config } = App.ConfigManager.get_config();
			const link = `${base_url}/password-reset?token=${token}`;
			const scenario = generate_scenario["password-reset"](
				user.body.e_mail,
				link
			);

			try {
				await send_email(nodemailer_config, scenario);
				return RESOLVE("email-sent");
			} catch (e) {
				console.log(e);
				console.log(
					"Failed to send. Deleting password reset intent..."
				);
				return app
					.run_action(
						new app.Sealious.SuperContext(),
						["collections", "tokens", intent.id],
						"delete"
					)
					.then(() => SEND_ERROR("email-failed"));
			}
		}
	);
