import React, { PureComponent } from "react";

export default class Navbar extends PureComponent {
	render() {
		return (
			<nav className="navigation">
				IS_LOGGED_IN:{this.props.is_logged_in.toString()}
			</nav>
		);
	}
}
