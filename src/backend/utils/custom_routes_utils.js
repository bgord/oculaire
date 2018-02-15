const ValidationError = require("sealious").Errors.ValidationError;

module.exports = messages => ({
	SEND_ERROR: SendErrorFactory(messages),
	RESOLVE: ResolveFactory(messages),
	VALIDATE_PARAMS: ValidateParamsFactory(messages),
});

function SendErrorFactory(messages) {
	return (reason, additional_info = {}) =>
		Promise.reject(
			new ValidationError({
				type: reason,
				content: messages[reason],
				additional_info,
			})
		);
}

function ResolveFactory(messages) {
	return (reason, additional_info = {}) => ({
		type: reason,
		content: messages[reason],
		additional_info,
	});
}

function ValidateParamsFactory(messages) {
	return (expected_params, params) => {
		const missing_params = expected_params.filter(name => !params[name]);
		if (missing_params.length !== 0) {
			return SendErrorFactory(messages)("missing-params", missing_params);
		}
	};
}
