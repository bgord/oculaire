import React, { PureComponent } from "react";
import axios from "axios";

export default (Component, title) =>
	class RequireLogin extends PureComponent {
		constructor() {
			super();
			this.state = {
				render_component: false,
				child_props: {},
			};
			document.title = "oculaire - autoryzacja";
		}
		componentDidMount() {
			return axios
				.get("/api/v1/users/me")
				.then(resp => {
					const { e_mail, gender, username } = resp.data.body;
					const child_props = {
						e_mail,
						gender,
						username,
					};
					this.setState({ render_component: true, child_props });
					document.title = title;
				})
				.catch(e => {
					this.setState({ render_component: false });
					document.location = "/login";
				});
		}
		render() {
			return this.state.render_component ? (
				<Component {...this.props} {...this.state.child_props} />
			) : (
				"Autoryzacja..."
			);
		}
	};
