const axios = require("axios");

describe("Days collection", () => {
	it("Allows a logged user to update water_intake field", () => {
		const test_day_url = `http://localhost:8081/api/v1/collections/days/${TEST_CONFIG
			.DAY.ID}`;
		return axios
			.patch(
				test_day_url,
				{ water_intake: 100 },
				TEST_CONFIG.USER.SESSION
			)
			.then(resp => Assert.equal(resp.data.body.water_intake, 100));
	});
	it("Doesn't allow a logged user to update date field", () => {
		const test_day_url = `http://localhost:8081/api/v1/collections/days/${TEST_CONFIG
			.DAY.ID}`;
		return axios
			.patch(
				test_day_url,
				{ date: "1999-12-30" },
				TEST_CONFIG.USER.SESSION
			)
			.catch(err => Assert.equal(err.response.status, 403));
	});
});
