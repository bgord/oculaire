const app = require("./src/backend/app.js");

app
	.start()
	.then(() =>
		app._app.Datastore.createIndex(
			"users",
			{ "body.e_mail": 1 },
			{ unique: true }
		)
	)
	.then(() =>
		app._app.Datastore.createIndex(
			"days",
			{ "body.date": 1, "body.user": 1 },
			{ unique: true }
		)
	);
