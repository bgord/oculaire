const axios = require("axios");
const get_collection_as = require("../test_utils/get_collection_as");

const DAY = 1000 * 60 * 60 * 24;
const TODAY = new Date().toISOString().split("T")[0];

describe("create_current_day_resources_for_every_user", () => {
	it("Creates current day resource when app starts (first tick)", () =>
		get_collection_as("days", "SOME")
			.then(days =>
				days.map(day => day.body.date).filter(day => day === TODAY)
			)
			.then(days => Assert.equal(days.length, 1)));
});
