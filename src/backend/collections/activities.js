module.exports = function(App) {
	const Activities = App.createCollection({
		name: "activities",
		fields: [
			{
				name: "day",
				type: "single_reference",
				params: { collection: "days" },
				required: true,
			},
			{
				name: "type",
				type: "text",
				required: true,
			},
			{
				name: "burnt_calories",
				type: "int",
				params: { min: 1 },
				required: true,
			},
			{ name: "distance", type: "float", params: { min: 1 } },
			{ name: "time", type: "int", params: { min: 1 } },
		],
		access_strategy: {
			default: "noone",
			create: "super",
			// logged_in strategy is temporary - it will eventually be replaced with the `day_owner` strategy
			retrieve: "logged_in",
		},
	});
};
