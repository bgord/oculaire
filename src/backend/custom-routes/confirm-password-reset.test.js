const axios = require("axios");
const uuid = require("uuid/v4");
const app = require("../app")._app;
const assert_missing_params_error = require("../test_utils/assert_missing_params_error");

const CONFIRM_PASSWORD_RESET_URL = `http://localhost:8081/api/v1/confirm-password-reset`;
const DAY = 1000 * 60 * 60 * 24;
const expired_token = uuid();
const active_token = uuid();

const create_password_reset_intent = intent =>
	app.run_action(
		new app.Sealious.SuperContext(),
		["collections", "tokens"],
		"create",
		intent
	);

describe("confirm-password-reset", () => {
	it("Rejects if token and password fields are empty", () =>
		axios
			.post(CONFIRM_PASSWORD_RESET_URL)
			.catch(e => assert_missing_params_error(e, ["token", "password"])));

	it("Rejects if token is invalid", () =>
		axios
			.post(CONFIRM_PASSWORD_RESET_URL, {
				token: "someinvalidtoken",
				password: "veryrandompassword",
			})
			.catch(e =>
				Assert.deepEqual(e.response.data.message.type, "invalid-token")
			));

	it("Rejects if token is expired", async () => {
		const expired_password_reset_intent = {
			type: "password-reset",
			token: expired_token,
			user: TEST_CONFIG.USERS.SOME.ID,
			expires_at: Date.now() - 2 * DAY,
		};
		await create_password_reset_intent(expired_password_reset_intent);
		return axios
			.post(CONFIRM_PASSWORD_RESET_URL, {
				token: expired_token,
				password: "veryrandompassword",
			})
			.catch(e =>
				Assert.deepEqual(e.response.data.message.type, "inactive-token")
			);
	});

	it("User can log in with the new password after change", async () => {
		const active_password_reset_intent = {
			type: "password-reset",
			token: active_token,
			user: TEST_CONFIG.USERS.SOME.ID,
			expires_at: Date.now() + DAY,
		};
		await create_password_reset_intent(active_password_reset_intent);
		return axios
			.post(CONFIRM_PASSWORD_RESET_URL, {
				token: active_token,
				password: "holy-flying-fuck",
			})
			.then(resp => Assert.deepEqual(resp.data.type, "password-changed"))
			.then(() =>
				axios.post(TEST_CONFIG.BASE_URL + "sessions", {
					username: "SOME",
					password: "holy-flying-fuck",
				})
			)
			.then(resp => Assert.deepEqual(resp.data.message, "Logged in!"));
	});
});
