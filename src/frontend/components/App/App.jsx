import React, { PureComponent, Fragment } from "react";
import handle_logout from "../../utils/logout";
import RequireLogin from "../../utils/RequireLogin";

export default RequireLogin(
	class App extends PureComponent {
		constructor() {
			super();
		}
		render() {
			return (
				<Fragment>
					<h2>App - restricted view for {this.props.e_mail} </h2>
					{/* This button is temporary and will be changed in  T644*/}
					<button onClick={handle_logout}>Logout</button>
				</Fragment>
			);
		}
	},
	"oculaire - dziennik kalorii"
);
