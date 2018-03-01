import React, { PureComponent, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import DayView from "../DayView/DayView";
import Arrow from "./Arrow";
import {
	parse_url_to_date_slug,
	get_date_slug,
	day_slug_to_weekday,
} from "../../utils/parse_url_to_date_slug";
import { get_date_info, get_dayproducts } from "../../utils/journal_utils";

export default withRouter(
	class Journal extends PureComponent {
		constructor() {
			super();
			this.state = {
				show_spinner: true,
				day: {},
				dayproducts: [],
				is_right_arrow_blocked: false,
			};
			this.hideSpinner = this.hideSpinner.bind(this);
			this.redirectToRelativeDate = this.redirectToRelativeDate.bind(
				this
			);
		}
		componentDidMount() {
			const self = this;
			const day_slug = parse_url_to_date_slug(
				this.props.match.params.date
			);
			const today = get_date_slug("today");
			this.setState({
				day_slug,
				is_right_arrow_blocked: day_slug === today,
				weekday: day_slug_to_weekday(day_slug),
			});
			return get_date_info(self, day_slug).then(() =>
				get_dayproducts(self)
			);
		}
		hideSpinner() {
			this.setState({ show_spinner: false });
		}
		redirectToRelativeDate(direction) {
			if (direction === "next" && this.state.is_right_arrow_blocked)
				return;
			const direction_to_number = {
				previous: -1,
				next: 1,
			};
			const next_day = new Date(this.state.day_slug);
			next_day.setDate(
				next_day.getDate() + direction_to_number[direction]
			);
			const next_location = `/app/journal/${get_date_slug(next_day)}`;
			this.props.history.push(next_location);
		}
		render() {
			return this.state.show_spinner ? (
				<Spinner />
			) : (
				<Fragment>
					<Arrow
						char="<"
						handleClick={() =>
							this.redirectToRelativeDate("previous")
						}
					/>
					<DayView {...this.state} />
					<Arrow
						char=">"
						is_blocked={this.state.is_right_arrow_blocked}
						handleClick={() => this.redirectToRelativeDate("next")}
					/>
				</Fragment>
			);
		}
	}
);
