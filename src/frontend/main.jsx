import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import classnames from "classnames";
import Navbar from "./components/Navbar/Navbar.jsx";
import RegisterIntent from "./components/RegisterIntent/RegisterIntent";
import Main from "./components/Main/Main";
import NoMatch from "./components/NoMatch/NoMatch";
import FinishRegistration from "./components/FinishRegistration/FinishRegistration";
import PasswordResetIntent from "./components/PasswordResetIntent/PasswordResetIntent";
import AddNewPassword from "./components/AddNewPassword/AddNewPassword";
import Login from "./components/Login/Login";
import App from "./components/App/App";
import FAQ from "./components/FAQ/FAQ";
import Logout from "./components/Logout/Logout";
import handle_logout from "./utils/logout";

export default class Application extends PureComponent {
	constructor() {
		super();
		this.state = {
			is_logged_in: false,
			user_data: {
				e_mail: "",
				gender: "",
				username: "",
			},
		};
		this.set_user_state = this.set_user_state.bind(this);
	}
	set_user_state(new_state) {
		this.setState(new_state);
	}
	render() {
		return (
			<Router>
				<Route
					render={({ location }) => (
						<div
							className={classnames({
								container: true,
								"container-app": location.pathname.includes(
									"/app/journal"
								),
							})}
						>
							<Navbar {...this.state} />
							<Switch>
								<Route path="/" exact component={Main} />
								<Route
									path="/register"
									exact
									component={RegisterIntent}
								/>
								<Route
									path="/finish-registration"
									exact
									component={FinishRegistration}
								/>
								<Route
									path="/password-reset-intent"
									exact
									component={PasswordResetIntent}
								/>
								<Route
									path="/password-reset"
									exact
									component={AddNewPassword}
								/>
								<Route path="/FAQ" exact component={FAQ} />
								<Route path="/login" exact component={Login} />
								<Route
									path="/app"
									render={({ match }) => (
										<App
											{...this.state}
											{...match}
											{...location}
											set_user_state={this.set_user_state}
										/>
									)}
								/>
								<Route
									path="/logout"
									exact
									render={() => (
										<Logout
											{...this.state}
											handle_logout={handle_logout}
										/>
									)}
								/>
								<Route component={NoMatch} />
							</Switch>
						</div>
					)}
				/>
			</Router>
		);
	}
}

ReactDOM.render(<Application />, document.getElementById("app"));
