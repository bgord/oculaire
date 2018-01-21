const create_day = require("../utils/create_day");
const assert = require("assert");

const messages = {
	"missing-param": "Nie wszystkie pola zostały podane: ",
	"wrong-token": "Nieznany lub nieaktywny token rejestracyjny.",
	"wrong-goal": "Cel musi być liczbą większą od zera.",
	"wrong-user-data": "Konto nie mogło zostać utworzone.",
	finished: "Pomyślnie ukończono proces rejestracji.",
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

const expected_params = ["token", "username", "password", "gender", "goal"];

module.exports = {
	messages,
	route: function(App, www_server) {
		www_server.custom_route(
			"POST",
			"/api/v1/finish-registration",
			async (app, context, params) => {
				const REJECT = SEND_ERROR(app.Sealious.Errors.ValidationError);
				const missing_params = expected_params.filter(
					name => !params[name]
				);
				if (missing_params.length !== 0) {
					return REJECT("missing-param", missing_params);
				}

				try {
					assert(Number.isInteger(+params.goal), "wrong-goal");
					assert(+params.goal > 0, "wrong-goal");
				} catch (e) {
					console.log(e);
					return REJECT(e.message);
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
					return REJECT("wrong-token");
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
						return REJECT("wrong-user-data");
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
	},
};
