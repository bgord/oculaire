import React, { PureComponent } from "react";
import Spinner from "../../components/Spinner/Spinner";

export default class Logout extends PureComponent {
	componentDidMount() {
		if (this.props.is_logged_in) {
			this.props.handle_logout();
		} else {
			document.location = "/";
		}
	}
	render() {
		return <Spinner />;
	}
}
