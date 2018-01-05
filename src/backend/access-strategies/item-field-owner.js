const Sealious = require("sealious");

const DENY = [{ $match: { _id: { $exists: false } } }];

module.exports = function(app) {
	return app.createChip(Sealious.AccessStrategyType, {
		name: "item-field-owner",
		get_pre_aggregation_stage: function(context, params) {
			if (!context.user_id) {
				return DENY;
			} else {
				return [
					{
						$match: {
							[`body.${params[0]}`]: context.user_id,
						},
					},
				];
			}
		},
		checker_function: function(context, params, item) {
			if (!context.user_id) {
				return Promise.reject("Nie jesteś zalogowany!");
			} else if (context.user_id === item.body[params[0]]) {
				return Promise.resolve();
			} else {
				return Promise.reject(
					`Nie jesteś właścicielem pola ${params[0]}!`
				);
			}
		},
		item_sensitive: true,
	});
};
