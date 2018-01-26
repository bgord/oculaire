import React, { PureComponent, Fragment } from "react";

export default class MaskablePassword extends PureComponent {
	constructor() {
		super();
		this.state = {
			unmask_password: false,
		};
		this.toggleUnmaskPassword = this.toggleUnmaskPassword.bind(this);
	}
	toggleUnmaskPassword() {
		this.setState({ unmask_password: !this.state.unmask_password });
	}
	render() {
		return (
			<Fragment>
				<label
					className="auth-section__form__label"
					htmlFor="password"
					style={{ position: "relative" }}
				>
					Hasło:
					<span
						className="unmask-password"
						onClick={this.toggleUnmaskPassword}
					>
						{this.state.unmask_password ? "ukryj" : "pokaż"}
					</span>
				</label>
				<input
					className="auth-section__form__input"
					value={this.props.password_value}
					onChange={this.props.handleChange}
					name="password"
					type={this.state.unmask_password ? "text" : "password"}
					placeholder="trudne-do-złamania"
					required
				/>
			</Fragment>
		);
	}
}
