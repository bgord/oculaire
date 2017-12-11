const axios = require("axios");

describe("Field-owner access-strategy", () => {
	const test_goal_url = `http://localhost:8081/api/v1/collections/goals`;
	const test_day_url = `http://localhost:8081/api/v1/collections/days/`;

	it("Allows a resource to be created only by the owner of the given collection field", () => {
		const valid_goal = {
			user: TEST_CONFIG.USER.ID,
			created_at: 123123123,
			calories_budget: 2222,
		};
		return axios
			.post(test_goal_url, valid_goal, TEST_CONFIG.USER.SESSION)
			.then(resp => Assert.equal(resp.status, 201));
	});
	it("Doesn't allow a resource to be created by a user that's not the owner of the given collection field", () => {
		const invalid_goal = {
			user: "Zy18vpSWe",
			created_at: 123123123,
			calories_budget: 2222,
		};
		return axios
			.post(test_goal_url, invalid_goal, TEST_CONFIG.USER.SESSION)
			.catch(err =>
				Assert.equal(
					err.response.data.message,
					"Nie jesteś właścicielem pola user!"
				)
			);
	});
	it("Allows a user to see a resource with the user field matching his context user_id", () =>
		axios
			.get(test_day_url + TEST_CONFIG.DAY.ID, TEST_CONFIG.USER.SESSION)
			.then(resp => Assert.equal(resp.status, 200)));
	it("Doesn't allow anyone to see a resource with the user field not matching his context user_id", () =>
		axios
			.get(test_day_url + TEST_CONFIG.DAY.ID)
			.catch(err =>
				Assert.equal(
					err.response.data.message,
					"Nie jesteś zalogowany!"
				)
			));
});
