const Promise = require("bluebird");
const TODAY = new Date().toISOString().split("T")[0];

module.exports = create_day = (App, ids) =>
	Promise.each(ids, user_id =>
		App.run_action(
			new App.Sealious.SuperContext(),
			["collections", "days"],
			"create",
			{
				date: TODAY,
				user: user_id,
				water_intake: 1,
			}
		)
	);
