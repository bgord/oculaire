const Promise = require("bluebird");
const axios = require("axios");
const assert = require("assert");

const axiosCookieJarSupport = require("@3846masa/axios-cookiejar-support");
const tough = require("tough-cookie");
axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

describe("Users collection", () => {
	it("returns an empty array", () =>
		axios
			.get("http://localhost:8081/api/v1/collections/users")
			.then(resp => Assert.deepEqual(resp.data, [])));
});
