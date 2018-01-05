module.exports = function(App) {
	const Dayproducts = App.createCollection({
		name: "dayproducts",
		fields: [
			{
				name: "day",
				type: "single_reference",
				params: { collection: "days" },
				required: true,
			},
			{
				name: "product",
				type: "single_reference",
				params: { collection: "products" },
				required: true,
			},
			{
				name: "product_weight",
				type: "int",
				params: { min: 1 },
				required: true,
			},
		],
		access_strategy: {
			default: [
				"collection-field-owner",
				[
					{
						localField: "day",
						collection: "days",
						foreignField: "user",
					},
				],
			],
		},
	});
};
