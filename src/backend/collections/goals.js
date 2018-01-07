module.exports = function(App) {
	const Goals = App.createCollection({
		name: "goals",
		fields: [
			{
				name: "user",
				type: "single_reference",
				params: { collection: "users" },
				required: true,
			},
			{
				name: "created_at",
				type: "datetime",
				required: true,
			},
			{
				name: "calories_budget",
				type: "int",
				params: { min: 1 },
				required: true,
			},
		],
		access_strategy: {
			default: ["or", ["super", ["item-field-owner", ["user"]]]],
			update: "noone",
			delete: "noone",
		},
	});
};
