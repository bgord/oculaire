const path = require("path");
const locreq = require("locreq")(__dirname);
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));

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

	www_server.custom_raw_route({
		method: ["GET"],
		path: "/{path*}",
		handler: function(request, reply) {
			if (request.url.pathname == "/") {
				reply.file("./public/index.html");
			} else {
				const absolute_file_path = locreq.resolve(
					"public/" + request.url.pathname
				);
				return Promise.promisify(fs.stat)(absolute_file_path)
					.then(() => reply.file(absolute_file_path))
					.catch({ code: "ENOENT" }, function() {
						reply.file(locreq.resolve("public/index.html"));
					})
					.catch(error => {
						console.error(error);
						reply("server error");
					});
			}
		},
	});
};
