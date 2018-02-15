module.exports = function(App) {
	const Products = App.createCollection({
		name: "products",
		fields: [
			{
				name: "name",
				type: "text",
				params: { include_in_search: true },
				required: true,
			},
			{
				name: "calories_per_100g",
				type: "int",
				params: {
					min: 1,
				},
				required: true,
			},
		],
		access_strategy: {
			default: "logged_in",
			update: "noone",
			delete: "noone",
		},
	});
};
