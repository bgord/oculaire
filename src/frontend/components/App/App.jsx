import React, { PureComponent, Fragment } from "react";
import RequireLogin from "../../utils/RequireLogin";

export default RequireLogin(
	class App extends PureComponent {
		constructor() {
			super();
		}
		render() {
			return (
				<Fragment>
					<h2>
						App - restricted view for {this.props.user_data.e_mail}{" "}
					</h2>
				</Fragment>
			);
		}
	},
	"oculaire - dziennik kalorii"
);
