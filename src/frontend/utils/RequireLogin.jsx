import React, { PureComponent } from "react";
import axios from "axios";
import Spinner from "../components/Spinner/Spinner";

export default Component =>
	class RequireLogin extends PureComponent {
		componentDidMount() {
			document.title = "oculaire - dziennik kalorii";
			if (this.props.is_logged_in) return null;
			else
				return axios
					.get("/api/v1/users/me")
					.then(resp => {
						const { e_mail, gender, username } = resp.data.body;
						this.props.set_user_state({
							is_logged_in: true,
							user_data: {
								e_mail,
								gender,
								username,
							},
						});
					})
					.catch(e => {
						this.props.set_user_state({
							is_logged_in: false,
							user_data: {},
						});
						const to = encodeURIComponent(document.URL);
						document.location = `/login?redirect=${to}`;
					});
		}
		render() {
			return this.props.is_logged_in ? (
				<Component {...this.props} />
			) : (
				<Spinner />
			);
		}
	};
