const app = require("./src/backend/app.js");
const Promise = require("bluebird");

const App = app._app;

const axios = require("axios");
const axiosCookieJarSupport = require("@3846masa/axios-cookiejar-support");
const tough = require("tough-cookie");
axiosCookieJarSupport(axios);

global.Assert = require("chai").assert;

const createCookieJar = () => ({
	jar: new tough.CookieJar(),
	withCredentials: true,
});

const login = ({ username, password }, SESSION) =>
	axios.post(
		"http://localhost:8081/api/v1/sessions",
		{ username, password },
		SESSION
	);

global.TEST_CONFIG = {
	USER: {
		CREDENTIALS: {
			username: "admin",
			password: "test",
			e_mail: "admin@test.org",
			gender: "m",
		},
		SESSION: createCookieJar(),
	},
	DAY: {
		date: "2010-10-10",
		water_intake: 22,
	},
};

before(() => {
	App.ConfigManager.set_config("datastore_mongo.db_name", "sealious_test");
	return app
		.start()
		.then(() =>
			App.run_action(
				new App.Sealious.SuperContext(),
				["collections", "users"],
				"create",
				TEST_CONFIG.USER.CREDENTIALS
			)
		)
		.then(({ id }) =>
			App.run_action(
				new App.Sealious.SuperContext(),
				["collections", "days"],
				"create",
				Object.assign({}, TEST_CONFIG.DAY, { user: id })
			)
		)
		.then(day => {
			global.TEST_CONFIG.DAY.ID = day.id;
			global.TEST_CONFIG.DAY.USER = day.body.user;
		})
		.then(() =>
			login(TEST_CONFIG.USER.CREDENTIALS, TEST_CONFIG.USER.SESSION)
		);
});

after(() =>
	Promise.all(
		App.ChipManager
			.get_all_collections()
			.map(collection_name =>
				App.Datastore.remove(collection_name, {}, "just_one" && false)
			)
	).then(() => console.log("### Cleared test database"))
);
