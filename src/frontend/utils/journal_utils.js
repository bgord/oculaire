import axios from "axios";

module.exports = {
	get_date_info,
	get_dayproducts,
	get_eaten_calories,
	get_eaten_calories_to_goal_ratio,
};

function get_date_info(self, date) {
	return axios
		.get(`/api/v1/collections/days?filter[date]=${date}`)
		.then(({ data: days }) => {
			if (days.length === 0) {
				throw new Error();
			}
			const day = days[0];
			const { id } = day;
			const {
				calories_budget: goal,
			} = day.calculated_fields.daily_calories_budget;
			const { date, water_intake } = day.body;
			self.setState({
				day: {
					id,
					goal,
					date,
					water_intake,
				},
			});
			self.hideSpinner();
		})
		.catch(e => {
			console.log(e);
			alert("Nie udało się pobrać danych o danym dniu.");
			document.location = "/app";
		});
}

function get_dayproducts(self) {
	return axios
		.get(
			`/api/v1/collections/dayproducts?filter[day]=${
				self.state.day.id
			}&format[product]=expand`
		)
		.then(resp => {
			const dayproducts = resp.data.map(entry => ({
				dayproduct_id: entry.id,
				created_at: entry.created_context.timestamp,
				product_weight: entry.body.product_weight,
				product_id: entry.body.product.id,
				product_name: entry.body.product.body.name,
				calories_per_100g: entry.body.product.body.calories_per_100g,
			}));
			return self.setState({ dayproducts });
		})
		.catch(e => {
			console.log(e);
			alert("Wystąpił błąd, spróbuj jeszcze raz.");
		});
}

function get_eaten_calories(dayproducts) {
	return dayproducts
		.reduce(
			(acc, curr) =>
				(acc += curr.calories_per_100g * (curr.product_weight / 100)),
			0
		)
		.toFixed(0);
}

function get_eaten_calories_to_goal_ratio(eaten, goal) {
	const percentage = (eaten / goal * 100).toFixed(0);
	return percentage ? (percentage >= 100 ? 100 : percentage) : 0;
}
