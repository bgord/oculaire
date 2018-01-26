import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import RegisterIntent from "./components/RegisterIntent/RegisterIntent";
import Main from "./components/Main/Main";
import NoMatch from "./components/NoMatch/NoMatch";
import FinishRegistration from "./components/FinishRegistration/FinishRegistration";
import Login from "./components/Login/Login";
import App from "./components/App/App";
import FAQ from "./components/FAQ/FAQ";

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
				<div className="container">
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
						<Route path="/FAQ" exact component={FAQ} />
						<Route path="/login" exact component={Login} />
						<Route
							path="/app"
							exact
							render={() => (
								<App
									{...this.state}
									set_user_state={this.set_user_state}
								/>
							)}
						/>
						<Route component={NoMatch} />
					</Switch>
				</div>
			</Router>
		);
	}
}

ReactDOM.render(<Application />, document.getElementById("app"));
