const axios = require("axios");
const sinon = require("sinon");

let clock;

const REGISTRATION_URL = `http://localhost:8081/api/v1/registration-intent`;
const WEEK = 1000 * 60 * 60 * 24 * 7;

describe("registration-intent", () => {
	it("Rejects when e_mail field is not present", () =>
		axios
			.post(REGISTRATION_URL)
			.catch(e =>
				Assert.deepEqual("no-email", e.response.data.message.type)
			));

	it("Rejects when account with the given e_mail exists", () =>
		axios
			.post(REGISTRATION_URL, {
				e_mail: TEST_CONFIG.USERS.SOME.CREDENTIALS.e_mail,
			})
			.catch(e =>
				Assert.deepEqual("email-taken", e.response.data.message.type)
			));
	it("Rejects if there's register intent with given e_mail", () =>
		axios
			.post(REGISTRATION_URL, {
				e_mail: "unique@ve.ry",
			})
			.then(() =>
				axios.post(REGISTRATION_URL, {
					e_mail: "unique@ve.ry",
				})
			)
			.catch(e =>
				Assert.deepEqual("email-taken", e.response.data.message.type)
			));

	it("Rejects if given email is invalid", () =>
		axios
			.post(REGISTRATION_URL, { e_mail: "cośzłego" })
			.catch(e =>
				Assert.deepEqual("email-invalid", e.response.data.message.type)
			));

	before(() => {
		clock = sinon.useFakeTimers(new Date());
	});
	it("Allows to create registration intent after token has expired", () =>
		axios
			.post(REGISTRATION_URL, {
				e_mail: "unusual@ve.ry",
			})
			.then(() => {
				clock.tick(WEEK);
				clock.next();
			})
			.then(() =>
				axios.post(REGISTRATION_URL, {
					e_mail: "unusual@ve.ry",
				})
			)
			.then(resp => Assert.deepEqual("email-sent", resp.data.type)));
	after(() => {
		clock.restore();
	});

	it("Sends email if everything is ok :)", () =>
		axios
			.post(REGISTRATION_URL, {
				e_mail: "random@ve.ry",
			})
			.then(resp => Assert.deepEqual("email-sent", resp.data.type)));
});
