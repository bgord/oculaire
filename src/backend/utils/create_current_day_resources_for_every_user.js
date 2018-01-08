const create_day = require("./create_day");

module.exports = create_current_day_resources_for_every_user = App => {
	const TODAY = new Date().toISOString().split("T")[0];
	//get all users
	return (
		App.run_action(
			new App.Sealious.SuperContext(),
			["collections", "users"],
			"show"
		)
			.map(user => user.id)
			//try to get current day resource for every user_id
			.then(user_ids =>
				Promise.all(
					user_ids.map(user_id =>
						App.run_action(
							new App.Sealious.SuperContext(),
							["collections", "days"],
							"show",
							{
								filter: {
									user: user_id,
									date: TODAY,
								},
							}
						)
							//there's always one day resource for specific date per user, so grab first item and match it with corresponding user_id
							.then(days =>
								Object.assign(
									{},
									{
										current_day: days[0],
									},
									{ user_id }
								)
							)
					)
				)
			)
			//filter out users that already own the day resource for today
			//and create day resource for those who don't have
			.then(users => {
				const user_ids_to_create_day_resource_for = users
					.filter(item => !item.current_day)
					.map(item => item.user_id);
				console.log(
					`Trying to create current day resources (${TODAY}) for users:`
				);
				console.log(user_ids_to_create_day_resource_for);
				if (user_ids_to_create_day_resource_for.length === 0) {
					console.log("Everyone is up to date...");
					return null;
				} else
					return create_day(App, user_ids_to_create_day_resource_for);
			})
	);
};
