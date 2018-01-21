const { endOfDay, format } = require("date-fns");

module.exports = function(App) {
	const Days = App.createCollection({
		name: "days",
		fields: [
			{
				name: "date",
				type: "control-update",
				params: {
					target_access_strategy: {
						update: "noone",
					},
					target_field_type: "date",
				},
				required: true,
			},
			{
				name: "user",
				type: "control-update",
				params: {
					target_access_strategy: {
						update: "noone",
					},
					target_field_type: "single_reference",
					target_params: { collection: "users" },
				},
				required: true,
			},
			{
				name: "water_intake",
				type: "int",
				params: {
					min: 1,
				},
				required: true,
			},
			{
				name: "weight",
				type: "float",
				params: {
					min: 1,
				},
			},
		],
		access_strategy: {
			default: ["or", ["super", ["item-field-owner", ["user"]]]],
			create: "super",
			delete: "noone",
		},
		calculated_fields: {
			daily_calories_budget: [
				"custom",
				function(app, context, item, db_document) {
					const day_date = db_document.body.date;
					const day_end =
						format(endOfDay(new Date(day_date)), "X") * 1000;
					return app
						.run_action(
							new app.Sealious.SuperContext(),
							["collections", "goals"],
							"show",

							{
								filter: {
									user: context.user_id,
									created_at: { "<=": day_end },
								},
								sort: { "body.created_at": "desc" },
								pagination: { items: 1 },
							}
						)
						.then(
							resp =>
								resp.length !== 0
									? {
											created_at: resp[0].body.created_at,
											calories_budget:
												resp[0].body.calories_budget,
										}
									: {}
						);
				},
			],
		},
	});
};
