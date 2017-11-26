const app = require("./src/backend/app.js");
const Promise = require("bluebird");

const App = app._app;

global.Assert = require("chai").assert;

before(() => {
	App.ConfigManager.set_config("datastore_mongo.db_name", "sealious_test");
	return app.start();
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
