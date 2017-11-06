module.exports = function(app) {
	var Users = app.ChipManager.get_chip("collection", "users");
	Users.set_access_strategy({
		default: "public",
	});
};
