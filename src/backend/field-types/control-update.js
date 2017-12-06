const Sealious = require("sealious");

module.exports = function(app) {
	return app.createChip(Sealious.FieldType, {
		name: "control-update",
		is_proper_value: function(context, params, new_value, old_value) {
			const target_field_type = new Sealious.FieldType(
				app,
				params.target_field_type
			);

			const target_access_strategy = new Sealious.AccessStrategy(
				app,
				params.target_access_strategy.update
			);

			const check_access = context.is_super
				? Promise.resolve()
				: target_access_strategy
						.check(context)
						.catch(err =>
							Promise.reject("Nie możesz edytować tego pola.")
						);

			return check_access.then(() =>
				target_field_type.is_proper_value(
					context,
					params.target_params,
					new_value,
					old_value
				)
			);
		},
	});
};
