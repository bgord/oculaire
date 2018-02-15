module.exports = (err, missing_params) =>
	Assert.deepEqual(err.response.data.message, {
		type: "missing-params",
		content: "Nie wszystkie pola zostały podane: ",
		additional_info: missing_params,
	});
