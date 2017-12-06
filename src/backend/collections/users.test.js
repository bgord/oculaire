const axios = require("axios");

describe("Users collection", () => {
	it("returns an empty array", () =>
		axios
			.get("http://localhost:8081/api/v1/collections/users")
			.then(resp => Assert.deepEqual(resp.data, [])));
});
