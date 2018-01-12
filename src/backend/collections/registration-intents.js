module.exports = function(App) {
	return App.createCollection({
		name: "registration-intents",
		fields: [
			{ name: "e_mail", type: "email", required: true },
			{ name: "token", type: "text", required: true },
			{ name: "expires_at", type: "datetime", required: true },
		],
		access_strategy: {
			default: "noone",
		},
	});
};
