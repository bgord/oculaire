const App = require("../app")._app;
const delete_expired_resources = require("./delete_expired_resources");
const DAY = 1000 * 60 * 60 * 24;

const create_intent = intent =>
	App.run_action(
		new App.Sealious.SuperContext(),
		["collections", "registration-intents"],
		"create",
		intent
	);

const show_collection = name =>
	App.run_action(
		new App.Sealious.SuperContext(),
		["collections", name],
		"show"
	);

const inactive_token = Date.now() - 2 * DAY;
const active_token = Date.now() + DAY;

describe("delete_expired_resources", () => {
	it("should throw an error when passing params in invalid format", () => {
		const invalid_params = [{ something: { is: { wrong: {} } } }];
		return Assert.throws(() =>
			delete_expired_resources(App, invalid_params)
		);
	});
	it("should throw an error when passing params with empty values", () => {
		const invalid_params = [{ collection: "", field: "" }];
		return Assert.throws(() =>
			delete_expired_resources(App, invalid_params)
		);
	});
	it("deletes expired registration intents", async () => {
		await App.Datastore.remove(
			"registration-intents",
			{},
			"just_one" && false
		);
		const intents = [
			{
				e_mail: "11@bin.ary",
				token: "ab",
				expires_at: inactive_token,
			},
			{ e_mail: "10@bin.ary", token: "bc", expires_at: inactive_token },
			{ e_mail: "01@bin.ary", token: "cd", expires_at: active_token },
			{ e_mail: "00@bin.ary", token: "de", expires_at: active_token },
		];
		await Promise.all(intents.map(intent => create_intent(intent)));
		const expired_resources_to_delete = [
			{ collection: "registration-intents", field: "expires_at" },
		];
		await delete_expired_resources(App, expired_resources_to_delete);
		const current_intents = await show_collection("registration-intents");
		return Assert.deepEqual(current_intents.length, 2);
	});
});
