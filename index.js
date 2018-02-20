const app = require("./src/backend/app.js");
const create_current_day_resources_for_every_user = require("./src/backend/utils/create_current_day_resources_for_every_user");
const delete_expired_resources = require("./src/backend/utils/delete_expired_resources");
const DAY = 1000 * 60 * 60 * 24;
const run_daily_at = require("./src/backend/utils/run_at_specified_time")(DAY);

const expired_resources_to_delete = [
	{ collection: "registration-intents", field: "expires_at" },
];

app
	.start()
	.then(() =>
		run_daily_at(
			10,
			11,
			() =>
				delete_expired_resources(app._app, expired_resources_to_delete),
			`Delete expired resources for: ${expired_resources_to_delete
				.map(entry => `${entry.collection} - ${entry.field}`)
				.join(", ")}.`
		)
	)
	.then(() =>
		run_daily_at(
			0,
			0,
			() => create_current_day_resources_for_every_user(app._app),
			"Create_current_day_resources_for_every_user"
		)
	);
