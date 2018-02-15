const axios = require("axios");

module.exports = login = ({ username, password }, SESSION) =>
	axios.post(
		TEST_CONFIG.BASE_URL + "sessions",
		{ username, password },
		SESSION
	);
