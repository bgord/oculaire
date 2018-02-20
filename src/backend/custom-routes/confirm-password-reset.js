const messages = {
	"missing-params": "Nie wszystkie pola zostały podane: ",
	"wrong-token": "Nieznany token resetujący hasło.",
	"inactive-token": "Nieaktywny token resetujący hasło.",
	"password-changed": "Hasło zostało zmienione.",
};

const {
	SEND_ERROR,
	RESOLVE,
	VALIDATE_PARAMS,
} = require("../utils/custom_routes_utils")(messages);

const expected_params = ["token", "password"];

module.exports = (App, www_server) =>
	www_server.custom_route(
		"POST",
		"/api/v1/confirm-password-reset",
		async (app, context, params) => {
			await VALIDATE_PARAMS(expected_params, params);
			const { token, password } = params;
			const [intent] = await app.run_action(
				new app.Sealious.SuperContext(),
				["collections", "tokens"],
				"show",
				{
					filter: {
						type: "password-reset",
						token,
					},
				}
			);
			if (!intent) {
				return SEND_ERROR("wrong-token");
			}
			if (intent.body.expires_at < Date.now()) {
				return SEND_ERROR("inactive-token");
			}
			await app.run_action(
				new app.Sealious.SuperContext(),
				["collections", "users", intent.body.user],
				"edit",
				{ password }
			);
			await app.run_action(
				new app.Sealious.SuperContext(),
				["collections", "tokens", intent.id],
				"delete"
			);
			return RESOLVE("password-changed");
		}
	);
