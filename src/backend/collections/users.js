module.exports = function(app) {
	const Users = app.ChipManager.get_chip("collection", "users");

	Users.add_fields([
		{
			name: "e_mail",
			type: "email",
			required: true,
		},
		{
			name: "gender",
			type: "enum",
			params: {
				values: ["m", "f"],
			},
			required: true,
		},
		{
			name: "strava_api_key",
			type: "text",
		},
	]);

	Users.set_access_strategy({
		default: "themselves",
		create: "noone",
		delete: "noone",
	});
};
