import React, { PureComponent } from "react";
import qs from "query-string";
import MaskablePassword from "../MaskablePassword/MaskablePassword";
import {
	confirm_token,
	require_url_token_to_mount_component,
} from "../../utils/forms_utils";

export default class AddNewPassword extends PureComponent {
	constructor() {
		super();
		this.state = {
			password: "",
		};
		document.title = "oculaire - nowe hasło";
		this.handleSubmit = this.handleSubmit.bind(this);
		this.generateChangeHandler = this.generateChangeHandler.bind(this);
		this.checkForToken = require_url_token_to_mount_component.bind(this);
	}
	componentWillMount() {
		this.checkForToken();
	}
	generateChangeHandler(name) {
		return e =>
			this.setState({
				[name]: e.target.value,
			});
	}

	handleSubmit(e) {
		e.preventDefault();
		return confirm_token({
			url: "/api/v1/confirm-password-reset",
			body: this.state,
			redirect_to_after_success: "/login",
			redirect_to_after_error: "/login",
		});
	}
	render() {
		return (
			<section className="auth-section ">
				<h2 className="auth-section__header">Nowe hasło</h2>
				<form
					action="post"
					onSubmit={this.handleSubmit}
					className="auth-section__form"
				>
					<MaskablePassword
						is_first_input={true}
						password_value={this.state.password}
						handleChange={this.generateChangeHandler("password")}
					/>
					<button className="auth-section__form__button">
						Zmień hasło
					</button>
				</form>
			</section>
		);
	}
}
