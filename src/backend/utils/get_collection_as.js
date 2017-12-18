const axios = require("axios");

module.exports = get_collection_as = (collection_name, user) => {
	const session = user ? TEST_CONFIG.USERS[user].SESSION : {};
	return axios
		.get(TEST_CONFIG.BASE_URL + "collections/" + collection_name, session)
		.then(({ data }) => data);
};
