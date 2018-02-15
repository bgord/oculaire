const app = require("../app")._app;
const tough = require("tough-cookie");
const axios = require("axios");
const uuid = require("uuid/v4");
const login = require("../test_utils/login");
const assert_missing_params_error = require("../test_utils/assert_missing_params_error");

const expired_intent_token = uuid();
const valid_intent_token = uuid();

const VALID_USER = {
	CREDENTIALS: {
		username: "mrrobot",
		password: "p455w0rd",
	},
	SESSION: {
		jar: new tough.CookieJar(),
		withCredentials: true,
	},
};

const FINISH_REGISTRATION_URL = `http://localhost:8081/api/v1/finish-registration`;
const WEEK = 1000 * 60 * 60 * 24 * 7;

const create_intent = intent =>
	app.run_action(
		new app.Sealious.SuperContext(),
		["collections", "registration-intents"],
		"create",
		intent
	);

describe("finish-registration", () => {
	it("Rejects if token is empty", () =>
		axios
			.post(FINISH_REGISTRATION_URL)
			.catch(e =>
				assert_missing_params_error(e, [
					"token",
					"username",
					"password",
					"gender",
					"goal",
				])
			));
	it("Rejects if token is wrong", () =>
		axios
			.post(FINISH_REGISTRATION_URL, {
				token: expired_intent_token,
				username: "antoni",
				password: "antoniowski",
				gender: "f",
				goal: {},
			})
			.catch(e =>
				Assert.deepEqual(e.response.data.message.type, "wrong-goal")
			));
	before(() =>
		create_intent({
			e_mail: "somefake@ma.il",
			token: expired_intent_token,
			expires_at: Date.now() - 2 * WEEK,
		})
	);
	it("Rejects when token has expired", () =>
		axios
			.post(FINISH_REGISTRATION_URL, {
				token: expired_intent_token,
				username: "antoni",
				password: "antoniowski",
				gender: "f",
				goal: 2000,
			})
			.catch(e =>
				Assert.deepEqual("wrong-token", e.response.data.message.type)
			));

	before(() =>
		create_intent({
			e_mail: "anotherfake@ma.il",
			token: valid_intent_token,
			expires_at: Date.now() + WEEK,
		})
	);
	it("Rejects when user couldn't have been created", () =>
		axios
			.post(FINISH_REGISTRATION_URL, {
				token: valid_intent_token,
				username: {},
				password: "x",
				gender: "aegeagaeg",
				goal: 2000,
			})
			.catch(e =>
				Assert.deepEqual(
					"wrong-user-data",
					e.response.data.message.type
				)
			));
	it("Creates account and day resource with given goal as calculated field if everything's ok", () =>
		axios
			.post(FINISH_REGISTRATION_URL, {
				token: valid_intent_token,
				...VALID_USER.CREDENTIALS,
				gender: "m",
				goal: 2000,
			})
			.then(() => login(VALID_USER.CREDENTIALS, VALID_USER.SESSION))
			.then(() =>
				axios.get(
					TEST_CONFIG.BASE_URL + "collections/days",
					VALID_USER.SESSION
				)
			)
			.then(resp =>
				Assert.equal(
					resp.data[0].calculated_fields.daily_calories_budget
						.calories_budget,
					2000
				)
			));
});
