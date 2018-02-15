const axios = require("axios");
const assert_missing_params_error = require("../test_utils/assert_missing_params_error");
const PASSWORD_RESET_INTENT_URL = `http://localhost:8081/api/v1/password-reset-intent`;

describe("password-reset-intent", () => {
	it("Rejects when e_mail field is not present", () =>
		axios
			.post(PASSWORD_RESET_INTENT_URL)
			.catch(e =>
				axios
					.post(PASSWORD_RESET_INTENT_URL)
					.catch(e => assert_missing_params_error(e, ["e_mail"]))
			));
	it("Rejects when account with given e_mail doesn't exist", () =>
		axios
			.post(PASSWORD_RESET_INTENT_URL, {
				e_mail: "toolatetoimprovise@oh.no",
			})
			.catch(e =>
				Assert.deepEqual("invalid-email", e.response.data.message.type)
			));
	it("Sends email if user with given e_mail exists", () =>
		axios
			.post(PASSWORD_RESET_INTENT_URL, {
				e_mail: "some@some.org",
			})
			.then(resp => Assert.deepEqual("email-sent", resp.data.type)));
});
