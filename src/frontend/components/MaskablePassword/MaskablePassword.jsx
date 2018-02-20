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
					className={`auth-section__form__label ${
						this.props.is_first_input
							? "auth-section__form__label--far-from-input auth-section__form__label--far-from-header"
							: ""
					}`}
					htmlFor="password"
					style={{ position: "relative" }}
				>
					Hasło:
					<span
						className="unmask-password"
						onClick={this.toggleUnmaskPassword}
						style={{
							display: this.props.password_value
								? "inline"
								: "none",
							top: this.props.is_first_input ? "2rem" : "1.5rem",
						}}
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
