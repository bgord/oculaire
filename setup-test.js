const app = require("./src/backend/app.js");
const Promise = require("bluebird");
const App = app._app;

const create_current_day_resources_for_every_user = require("./src/backend/utils/create_current_day_resources_for_every_user");
const DAY = 1000 * 60 * 60 * 24;
const run_daily_at = require("./src/backend/utils/run_at_specified_time")(DAY);

const axios = require("axios");
const axiosCookieJarSupport = require("@3846masa/axios-cookiejar-support");
const tough = require("tough-cookie");
axiosCookieJarSupport(axios);
const login = require("./src/backend/utils/login");

global.Assert = require("chai").assert;

const createCookieJar = () => ({
	jar: new tough.CookieJar(),
	withCredentials: true,
});

global.TEST_CONFIG = {
	USERS: {
		SOME: {
			CREDENTIALS: {
				username: "SOME",
				password: "some_password",
				e_mail: "some@some.org",
				gender: "m",
			},
			SESSION: createCookieJar(),
			DAYS: [
				{
					date: "2012-12-12",
					water_intake: 2000,
				},
				{
					date: "2012-12-13",
					water_intake: 2200,
				},
			],
		},
		ANOTHER: {
			CREDENTIALS: {
				username: "ANOTHER",
				password: "another_password",
				e_mail: "another@another.org",
				gender: "f",
			},
			SESSION: createCookieJar(),
			DAYS: [
				{
					date: "2012-12-12",
					water_intake: 2000,
				},
				{
					date: "2012-12-13",
					water_intake: 1900,
				},
			],
		},
	},
	PRODUCTS: {
		APPLE: {
			DATA: {
				name: "apple",
				calories_per_100g: 57,
			},
		},
		CHEESE: {
			DATA: {
				name: "cheese",
				calories_per_100g: 113,
			},
		},
		BREAD: {
			DATA: {
				name: "bread",
				calories_per_100g: 80,
			},
		},
	},
};

const create_resource = (collection_name, data) =>
	App.run_action(
		new App.Sealious.SuperContext(),
		["collections", collection_name],
		"create",
		data
	);

before(() => {
	App.ConfigManager.set_config("datastore_mongo.db_name", "sealious_test");
	return app
		.start()
		.then(() => {
			const { port } = App.ConfigManager.get_config("www-server");
			global.TEST_CONFIG.BASE_URL = `http://localhost:${port}/api/v1/`;
		})
		.then(() =>
			Promise.all(
				Object.keys(TEST_CONFIG.USERS).map(key =>
					create_resource("users", TEST_CONFIG.USERS[key].CREDENTIALS)
				)
			)
		)
		.then(users => {
			users.forEach(user => {
				const { username } = user.body;
				TEST_CONFIG.USERS[username].ID = user.id;
				TEST_CONFIG.USERS[username].DAYS.forEach(day => {
					day.user = user.id;
				});
			});
		})
		.then(() =>
			Promise.all(
				Object.keys(TEST_CONFIG.USERS).map(user =>
					login(
						TEST_CONFIG.USERS[user].CREDENTIALS,
						TEST_CONFIG.USERS[user].SESSION
					)
				)
			)
		)
		.then(() =>
			Promise.all(
				Object.keys(TEST_CONFIG.PRODUCTS).map(key =>
					create_resource("products", TEST_CONFIG.PRODUCTS[key].DATA)
				)
			)
		)
		.then(products => {
			products.forEach(product => {
				const key = product.body.name.toUpperCase();
				TEST_CONFIG.PRODUCTS[key].ID = product.id;
			});
		})
		.then(() =>
			Object.keys(TEST_CONFIG.USERS).forEach(user =>
				Promise.all(
					TEST_CONFIG.USERS[user].DAYS.map(day =>
						create_resource("days", day)
					)
				)
			)
		)
		.then(() =>
			run_daily_at(
				0,
				0,
				() => create_current_day_resources_for_every_user(App),
				"Create_current_day_resources_for_every_user"
			)
		);
});

after(() =>
	Promise.all(
		App.ChipManager.get_all_collections().map(collection_name =>
			App.Datastore.remove(collection_name, {}, "just_one" && false)
		)
	).then(() => console.log("### Cleared test database"))
);
