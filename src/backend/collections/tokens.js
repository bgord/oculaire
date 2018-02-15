module.exports = App =>
	App.createCollection({
		name: "tokens",
		fields: [
			{
				name: "type",
				type: "enum",
				params: { values: ["password-reset"] },
				required: true,
			},
			{ name: "token", type: "text", required: true },
			{
				name: "user",
				type: "single_reference",
				params: { collection: "users" },
				required: true,
			},
			{ name: "expires_at", type: "datetime", required: true },
		],
		access_strategy: {
			default: "noone",
		},
	});
