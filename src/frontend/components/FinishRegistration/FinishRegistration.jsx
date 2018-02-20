import React, { PureComponent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MaskablePassword from "../MaskablePassword/MaskablePassword";
import {
	confirm_token,
	require_url_token_to_mount_component,
} from "../../utils/forms_utils";

export default class FinishRegistration extends PureComponent {
	constructor() {
		super();
		this.state = {
			gender: "choose-gender",
			goal: 2000,
			password: "",
			token: null,
			username: "",
		};
		document.title = "oculaire - potwierdź rejestrację";
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
		if (this.state.gender === "choose-gender") {
			alert("Wybierz swój preferowany zaimek.");
		} else
			return confirm_token({
				url: "/api/v1/finish-registration",
				body: this.state,
				redirect_to_after_success: "/login",
				redirect_to_after_error: "/register",
			});
	}
	render() {
		return (
			<section className="auth-section auth-section--close-to-top">
				<h2 className="auth-section__header">Potwierdź rejestrację</h2>
				<form
					action="post"
					onSubmit={this.handleSubmit}
					className="auth-section__form"
				>
					<label
						className="auth-section__form__label auth-section__form__label--close-to-header"
						htmlFor="username"
					>
						Nazwa użytkownika:
					</label>
					<input
						className="auth-section__form__input"
						value={this.state.username}
						onChange={this.generateChangeHandler("username")}
						name="username"
						placeholder="nazw4-użytk0wnik4"
						autoFocus
						required
					/>

					<MaskablePassword
						password_value={this.state.password}
						handleChange={this.generateChangeHandler("password")}
					/>

					<label
						className="auth-section__form__label"
						htmlFor="gender"
					>
						Preferowany zaimek:
					</label>
					<select
						className="auth-section__form__select"
						value={this.state.gender}
						onChange={this.generateChangeHandler("gender")}
						name="gender"
						required
					>
						<option value="choose-gender">Wybierz zaimek</option>
						<option value="f">żeński</option>
						<option value="m">męski</option>
					</select>

					<label className="auth-section__form__label" htmlFor="goal">
						Cel kcal/dzień: (<a
							target="_blank"
							href="/FAQ#jak-rozsądnie-wybrać-cel"
						>
							jak wybrać cel?
						</a>)
					</label>
					<input
						className="auth-section__form__input auth-section__form__input--number"
						value={this.state.goal}
						onChange={this.generateChangeHandler("goal")}
						name="goal"
						min="0"
						type="number"
						required
					/>

					<button className="auth-section__form__button">
						Utwórz konto
					</button>
				</form>
			</section>
		);
	}
}
