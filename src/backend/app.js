const Sealious = require("sealious");

const App = new Sealious.App();

const dependencies = ["collections/users.js", "collections/products.js"];

dependencies.forEach(dependency => require(`./${dependency}`)(App));

module.exports = {
	start: () => App.start(),
	_app: App,
};
