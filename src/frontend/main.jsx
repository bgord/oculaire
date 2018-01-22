import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import RegisterIntent from "./components/RegisterIntent/RegisterIntent";
import Main from "./components/Main/Main";
import NoMatch from "./components/NoMatch/NoMatch";
import FinishRegistration from "./components/FinishRegistration/FinishRegistration";

const App = () => (
	<Router>
		<div className="container">
			<Navbar />
			<Switch>
				<Route path="/" exact component={Main} />
				<Route path="/register" exact component={RegisterIntent} />
				<Route
					path="/finish-registration"
					exact
					component={FinishRegistration}
				/>
				<Route component={NoMatch} />
			</Switch>
		</div>
	</Router>
);

ReactDOM.render(<App />, document.getElementById("app"));
