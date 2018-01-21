import React, { PureComponent, Fragment } from "react";
import { Link } from "react-router-dom";

export default class NoMatch extends PureComponent {
	componentDidMount() {
		document.title = "oculaire - nie znaleziono";
		setTimeout(() => {
			document.location = "/";
		}, 3000);
	}
	render() {
		return (
			<Fragment>
				<h2 style={{ fontSize: "0.75rem" }}>
					Strona o podanym adresie nie istnieje.
				</h2>
				<span style={{ textAlign: "center", fontWeight: "300" }}>
					Za 3 sekundy nastąpi przekierowywanie na{" "}
					<Link to="/">stronę główną </Link>.
				</span>
			</Fragment>
		);
	}
}
