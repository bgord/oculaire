const {
	parse_url_to_date_slug,
	get_date_slug,
} = require("./parse_url_to_date_slug");

describe("parse_url_to_date_slug", () => {
	it("returns `today` if given day param is empty", () => {
		const TODAY = get_date_slug("today");
		Assert.deepEqual(parse_url_to_date_slug(), TODAY);
		Assert.deepEqual(parse_url_to_date_slug(""), TODAY);
	});
	it("returns `today` if given day param is an invalid date", () => {
		const TODAY = get_date_slug("today");
		Assert.deepEqual(parse_url_to_date_slug("xd"), TODAY);
		Assert.deepEqual(parse_url_to_date_slug("123123123"), TODAY);
	});
	it("returns `today` if given day param is from the future", () => {
		const TODAY = get_date_slug("today");
		Assert.deepEqual(parse_url_to_date_slug("2120-02-02"), TODAY);
	});
	it("returns given day back if given day param is from the past", () => {
		const TODAY = get_date_slug("today");
		Assert.deepEqual(parse_url_to_date_slug("2010-02-02"), "2010-02-02");
	});
	it("returns today back", () => {
		const TODAY = get_date_slug("today");
		Assert.deepEqual(parse_url_to_date_slug(TODAY), TODAY);
		Assert.deepEqual(parse_url_to_date_slug("today"), TODAY);
	});
});
