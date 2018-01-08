const app = require("./src/backend/app.js");
const create_current_day_resources_for_every_user = require("./src/backend/utils/create_current_day_resources_for_every_user");
const DAY = 1000 * 60 * 60 * 24;
const run_daily_at = require("./src/backend/utils/run_at_specified_time")(DAY);

app.start().then(() => {
	run_daily_at(
		0,
		0,
		() => create_current_day_resources_for_every_user(app._app),
		"Create_current_day_resources_for_every_user"
	);
});
