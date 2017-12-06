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
			create: "super",
			delete: "noone",
			// logged_in strategy is temporary - it will eventually be replaced with the `field_owner` strategy
			retrieve: "logged_in",
			update: "logged_in",
		},
	});
};
