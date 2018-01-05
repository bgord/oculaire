const axios = require("axios");
const get_collection_as = require("../utils/get_collection_as");
const { _app: App } = require("../app");

const create_resource_as = (collection_name, data, user = null) => {
	const session = user ? TEST_CONFIG.USERS[user].SESSION : {};
	return axios.post(
		`${TEST_CONFIG.BASE_URL}collections/${collection_name}`,
		data,
		session
	);
};

const clear_collection = collection_name =>
	App.Datastore.remove(collection_name, {}, "just_one" && false);

describe("Day-owner access-strategy", () => {
	it("Allows a resource to be created only by the owner of the day field of a resource", () => {
		const day_product = {
			product: TEST_CONFIG.PRODUCTS.APPLE.ID,
			product_weight: 200,
		};
		return get_collection_as("days", "SOME")
			.then(days => {
				const { id } = days[0];
				day_product.day = id;
			})
			.then(() =>
				create_resource_as("dayproducts", day_product, "SOME").then(
					resp => Assert.equal(resp.status, 201)
				)
			);
	});
	it("Doesn't allow a resource to be created by user who is not the owner of the day field of a resource", () => {
		const day_product = {
			product: TEST_CONFIG.PRODUCTS.BREAD.ID,
			product_weight: 100,
		};
		return get_collection_as("days", "SOME")
			.then(days => {
				const { id } = days[0];
				day_product.day = id;
			})
			.then(() =>
				create_resource_as("dayproducts", day_product, "ANOTHER").catch(
					err =>
						Assert.equal(
							err.response.data.message,
							`Zasób w kolekcji days, na który wskazuje pole day tego zasobu, nie należy do ciebie!`
						)
				)
			);
	});
	before(() => clear_collection("dayproducts"));
	it("Allows a user to see only resources with day field owned by himself", () => {
		const some_day_product = {
			product: TEST_CONFIG.PRODUCTS.BREAD.ID,
			product_weight: 100,
		};
		const another_day_product = {
			product: TEST_CONFIG.PRODUCTS.BREAD.ID,
			product_weight: 100,
		};
		return get_collection_as("days", "SOME")
			.then(days => {
				const { id } = days[0];
				some_day_product.day = id;
			})
			.then(() => get_collection_as("days", "ANOTHER"))
			.then(days => {
				const { id } = days[0];
				another_day_product.day = id;
			})
			.then(() =>
				create_resource_as("dayproducts", some_day_product, "SOME")
			)
			.then(() =>
				create_resource_as(
					"dayproducts",
					another_day_product,
					"ANOTHER"
				)
			)
			.then(() => get_collection_as("dayproducts", "ANOTHER"))
			.then(dayproducts => Assert.equal(dayproducts.length, 1));
	});
	after(() => clear_collection("dayproducts"));
});
