const DAY = 1000 * 60 * 60 * 24;

const prefill = num => (num < 10 ? `0${num}` : num);

module.exports = run_at_specified_time = interval => (
	hour,
	minute,
	callback,
	name = "A function"
) => {
	const now = new Date();

	let ms_until_second_trigger =
		new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
			hour,
			minute,
			0,
			0
		) - now;
	if (ms_until_second_trigger < 0) {
		ms_until_second_trigger += DAY; // it's after 9am, try 9am tomorrow.
	}
	console.log(
		`'${name}' has been set up to run with inverval: ${interval}ms at ${prefill(
			hour
		)}:${prefill(
			minute
		)}. First trigger - now. Second trigger in ${ms_until_second_trigger}ms.`
	);
	callback();
	setTimeout(() => {
		setInterval(callback, interval);
	}, ms_until_second_trigger);
};
