module.exports = function(App) {
	const www_server = App.ChipManager.get_chip("channel", "www-server");

	require("./src/backend/custom-routes/registration-intent").route(
		App,
		www_server
	);
	require("./src/backend/custom-routes/finish-registration").route(
		App,
		www_server
	);
};
