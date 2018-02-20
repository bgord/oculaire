const assert = require("assert");
const Promise = require("bluebird");

module.exports = delete_expired_resources = (
	App,
	expired_resources_to_delete
) => {
	assert(Array.isArray(expired_resources_to_delete));
	expired_resources_to_delete.forEach(entry => {
		assert(entry.collection.length > 0);
		assert(entry.field.length > 0);
	});
	console.log(`Deleting resources that expired before ${new Date()}.`);
	return Promise.each(expired_resources_to_delete, entry =>
		App.Datastore.remove(entry.collection, {
			body: {
				[entry.field]: {
					$lt: Date.now(),
				},
			},
		})
	);
};
