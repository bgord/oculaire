import React from "react";
import {
	get_eaten_calories,
	get_eaten_calories_to_goal_ratio,
} from "../../utils/journal_utils";

module.exports = props => {
	const { goal } = props.day;
	const eaten_calories = get_eaten_calories(props.dayproducts);
	const eaten_calories_to_goal_ratio = get_eaten_calories_to_goal_ratio(
		eaten_calories,
		goal
	);
	return (
		<section className="day-view">
			<h2 className="day-view__header">
				{props.day.date} ({props.weekday})
			</h2>
			<div className="day-view__goal">
				<div className="day-view__goal__desc">
					Bilans: {eaten_calories}/<strong>{props.day.goal}</strong>{" "}
					kcal
				</div>
				<div
					className="day-view__goal__progress_bar"
					style={{ width: `${eaten_calories_to_goal_ratio}%` }}
				/>
			</div>
		</section>
	);
};
