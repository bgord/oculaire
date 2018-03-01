const prefill = num => (num < 10 ? `0${num}` : num);

const get_date_slug = date => {
	let created_date = date === "today" ? new Date() : new Date(date);
	const day = prefill(created_date.getDate());
	const month = prefill(created_date.getMonth() + 1);
	const year = created_date.getFullYear();
	return `${year}-${month}-${day}`;
};
const is_date_valid = day_from_url => {
	const timestamp = Date.parse(day_from_url);
	return !isNaN(timestamp) && timestamp < Date.now();
};

const day_order_to_name = {
	0: "nie",
	1: "pon",
	2: "wt",
	3: "śr",
	4: "czw",
	5: "pt",
	6: "sob",
};

module.exports = {
	parse_url_to_date_slug: day_from_url =>
		is_date_valid(day_from_url)
			? get_date_slug(day_from_url)
			: get_date_slug("today"),
	get_date_slug,
	day_slug_to_weekday: day_slug => {
		const weekday = new Date(day_slug).getDay();
		return day_order_to_name[weekday];
	},
};
