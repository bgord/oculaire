const Sealious = require("sealious");

const DENY = [{ $match: { _id: { $exists: false } } }];

module.exports = function(app) {
	return app.createChip(Sealious.AccessStrategyType, {
		name: "collection-field-owner",
		get_pre_aggregation_stage: function(context, params) {
			const { localField, collection, foreignField } = params[0];
			if (!context.user_id) {
				return DENY;
			} else {
				return [
					{
						$lookup: {
							from: collection,
							localField: `body.${localField}`,
							foreignField: "sealious_id",
							as: "resource",
						},
					},
					{
						$match: {
							[`resource.body.${foreignField}`]: context.user_id,
						},
					},
				];
			}
		},
		checker_function: function(context, params, item) {
			const { localField, collection, foreignField } = params[0];

			if (!context.user_id) {
				return Promise.reject("Nie jesteś zalogowany!");
			}
			const search_by = item.body[localField];

			return app
				.run_action(
					new app.Sealious.SuperContext(),
					["collections", collection, search_by],
					"show"
				)
				.then(resource => {
					if (resource.body[foreignField] === context.user_id) {
						return Promise.resolve();
					} else {
						return Promise.reject(
							`Zasób w kolekcji ${collection}, na który wskazuje pole ${localField} tego zasobu, nie należy do ciebie!`
						);
					}
				});
		},
		item_sensitive: true,
	});
};
