const Sealious = require("sealious");

const App = new Sealious.App();

const dependencies = [
	"field-types/control-update.js",
	"access-strategies/field-owner.js",
	"collections/users.js",
	"collections/products.js",
	"collections/days.js",
	"collections/goals.js",
	"collections/dayproducts.js",
	"collections/activities.js",
];

dependencies.forEach(dependency => require(`./${dependency}`)(App));

module.exports = {
	start: () => App.start(),
	_app: App,
};
