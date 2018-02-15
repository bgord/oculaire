const Sealious = require("sealious");

const App = new Sealious.App();

require("../../custom-routes")(App);

const dependencies = [
	"field-types/control-update.js",
	"access-strategies/item-field-owner.js",
	"access-strategies/collection-field-owner.js",
	"collections/users.js",
	"collections/registration-intents.js",
	"collections/products.js",
	"collections/days.js",
	"collections/goals.js",
	"collections/dayproducts.js",
	"collections/activities.js",
	"collections/tokens.js",
];

dependencies.forEach(dependency => require(`./${dependency}`)(App));

module.exports = {
	start: () =>
		App.start()
			.then(() =>
				App.Datastore.createIndex(
					"users",
					{ "body.e_mail": 1 },
					{ unique: true }
				)
			)
			.then(() =>
				App.Datastore.createIndex(
					"days",
					{ "body.date": 1, "body.user": 1 },
					{ unique: true }
				)
			),
	_app: App,
};
