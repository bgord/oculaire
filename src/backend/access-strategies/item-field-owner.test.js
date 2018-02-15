const axios = require("axios");
const get_collection_as = require("../test_utils/get_collection_as");

describe("Field-owner access-strategy", () => {
	it("Allows a resource to be created only by the owner of the given collection field", () => {
		const test_goal_url = `${TEST_CONFIG.BASE_URL}collections/goals`;
		const valid_goal = {
			user: TEST_CONFIG.USERS.SOME.ID,
			created_at: 123123123,
			calories_budget: 2222,
		};
		return axios
			.post(test_goal_url, valid_goal, TEST_CONFIG.USERS.SOME.SESSION)
			.then(resp => Assert.equal(resp.status, 201));
	});
	it("Doesn't allow a resource to be created by a user that's not the owner of the given collection field", () => {
		const test_goals_url = `${TEST_CONFIG.BASE_URL}collections/goals`;
		const invalid_goal = {
			user: TEST_CONFIG.USERS.ANOTHER.ID,
			created_at: 123123123,
			calories_budget: 2222,
		};
		return axios
			.post(test_goals_url, invalid_goal, TEST_CONFIG.USERS.SOME.SESSION)
			.catch(err =>
				Assert(
					err.response.data.message.indexOf(
						"Nie jesteś właścicielem pola user!"
					) !== -1
				)
			);
	});
	it("Allows a user to see resources with the user field matching his context user_id", () =>
		get_collection_as("days", "SOME").then(days =>
			days.forEach(day =>
				Assert.equal(TEST_CONFIG.USERS.SOME.ID, day.body.user)
			)
		));
});
