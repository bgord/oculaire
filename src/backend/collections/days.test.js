const axios = require("axios");
const get_collection_as = require("../utils/get_collection_as");

describe("Days collection", () => {
	it("Allows the owner to update his water_intake field", () => {
		const test_day_url = TEST_CONFIG.BASE_URL + "collections/days/";
		return get_collection_as("days", "SOME")
			.then(days => days[0].id)
			.then(id =>
				axios
					.patch(
						test_day_url + id,
						{ water_intake: 100 },
						TEST_CONFIG.USERS.SOME.SESSION
					)
					.then(({ data }) =>
						Assert.equal(data.body.water_intake, 100)
					)
			);
	});
	it("Doesn't allow the owner to update his date field", () => {
		const test_day_url = TEST_CONFIG.BASE_URL + "collections/days/";

		return get_collection_as("days", "SOME")
			.then(days => days[0].id)
			.then(id =>
				axios.patch(
					test_day_url + id,
					{ date: "1997-12-12" },
					TEST_CONFIG.USERS.SOME.SESSION
				)
			)
			.catch(err => Assert.equal(err.response.status, 403));
	});
});
