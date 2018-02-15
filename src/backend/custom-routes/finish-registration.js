const create_day = require("../utils/create_day");
const assert = require("assert");

const messages = {
	"missing-params": "Nie wszystkie pola zostały podane: ",
	"wrong-token": "Nieznany lub nieaktywny token rejestracyjny.",
	"wrong-goal": "Cel musi być liczbą większą od zera.",
	"wrong-user-data": "Konto nie mogło zostać utworzone.",
	finished: "Pomyślnie ukończono proces rejestracji.",
};
const {
	SEND_ERROR,
	RESOLVE,
	VALIDATE_PARAMS,
} = require("../utils/custom_routes_utils")(messages);

const expected_params = ["token", "username", "password", "gender", "goal"];

module.exports = (App, www_server) =>
	www_server.custom_route(
		"POST",
		"/api/v1/finish-registration",
		async (app, context, params) => {
			await VALIDATE_PARAMS(expected_params, params);
			try {
				assert(Number.isInteger(+params.goal), "wrong-goal");
				assert(+params.goal > 0, "wrong-goal");
			} catch (e) {
				console.log(e);
				return SEND_ERROR(e.message);
			}

			const [intent] = await app.run_action(
				new app.Sealious.SuperContext(),
				["collections", "registration-intents"],
				"show",
				{
					filter: {
						token: params.token,
						expires_at: { ">=": Date.now() },
					},
				}
			);
			if (!intent) {
				return SEND_ERROR("wrong-token");
			}

			const user = await app
				.run_action(
					new app.Sealious.SuperContext(),
					["collections", "users"],
					"create",
					{
						username: params.username,
						password: params.password,
						e_mail: intent.body.e_mail,
						gender: params.gender,
					}
				)
				.catch(e => {
					console.log(e);
					return SEND_ERROR("wrong-user-data");
				});
			await app.run_action(
				new app.Sealious.SuperContext(),
				["collections", "registration-intents", intent.id],
				"delete"
			);
			await app.run_action(
				new app.Sealious.SuperContext(),
				["collections", "goals"],
				"create",
				{
					user: user.id,
					created_at: Date.now(),
					calories_budget: params.goal,
				}
			);
			await create_day(app, [user.id]);
			return RESOLVE("finished");
		}
	);
