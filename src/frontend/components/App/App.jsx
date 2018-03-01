import React from "react";
import RequireLogin from "../../utils/RequireLogin";
import { Route, Switch, Redirect } from "react-router-dom";
import Journal from "../Journal/Journal";

const APP_MAIN_PAGE = "/app/journal/today";

export default RequireLogin(props => (
	<Switch>
		<Route
			exact
			path={props.url}
			render={() => <Redirect to={APP_MAIN_PAGE} />}
		/>
		<Route
			exact
			path={props.url + "/journal"}
			render={() => <Redirect to={APP_MAIN_PAGE} />}
		/>
		<Route
			exact
			path={props.url + "/journal/:date"}
			render={() => <Journal {...props} />}
		/>
		<Route render={() => <Redirect to={APP_MAIN_PAGE} />} />
	</Switch>
));
