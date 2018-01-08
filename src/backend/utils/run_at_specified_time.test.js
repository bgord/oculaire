const DAY = 1000 * 60 * 60 * 24;
const run_daily_at = require("./run_at_specified_time")(DAY);

const sinon = require("sinon");
let clock;

before(() => {
	clock = sinon.useFakeTimers(new Date());
});
describe("run_at_specified_time", () => {
	it("Runs given callback now, and after specified hour (the next day)", () => {
		let counter = 0;
		return Promise.resolve()
			.then(() =>
				run_daily_at(
					19,
					09,
					() => {
						counter++;
					},
					"Increment counter"
				)
			)
			.then(() => {
				clock.tick(DAY);
				clock.next();
			})
			.then(() => Assert.equal(counter, 2));
	});
});
after(() => {
	clock.restore();
});
