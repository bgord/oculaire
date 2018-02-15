const axios = require("axios");
const get_collection_as = require("../test_utils/get_collection_as");

const create_resource_as = (collection_name, data, user = null) => {
	const session = user ? TEST_CONFIG.USERS[user].SESSION : {};
	return axios.post(
		`${TEST_CONFIG.BASE_URL}collections/${collection_name}`,
		data,
		session
	);
};

describe("Daily_calories_budget caluculated field", () => {
	it("Returns proper daily_calories_budget objects", () => {
		const goal_from_2012_12_06 = {
			created_at: 1354752000000,
			user: TEST_CONFIG.USERS.SOME.ID,
			calories_budget: 1900,
		};
		const goal_from_2012_12_13 = {
			created_at: 1355407200000,
			user: TEST_CONFIG.USERS.SOME.ID,
			calories_budget: 2000,
		};

		return create_resource_as("goals", goal_from_2012_12_06, "SOME")
			.then(() =>
				create_resource_as("goals", goal_from_2012_12_13, "SOME")
			)
			.then(() => get_collection_as("days", "SOME"))
			.then(days => {
				const day_2012_12_13 = days.filter(
					day => day.body.date === "2012-12-13"
				)[0];
				const day_2012_12_12 = days.filter(
					day => day.body.date === "2012-12-12"
				)[0];

				Assert.equal(
					day_2012_12_12.calculated_fields.daily_calories_budget
						.calories_budget,
					goal_from_2012_12_06.calories_budget
				);
				Assert.equal(
					day_2012_12_13.calculated_fields.daily_calories_budget
						.calories_budget,
					goal_from_2012_12_13.calories_budget
				);
			});
	});
});
