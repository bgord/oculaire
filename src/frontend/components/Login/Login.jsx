import React, { PureComponent } from "react";
import axios from "axios";
import handle_login from "../../utils/login";
import { Link } from "react-router-dom";

export default class Login extends PureComponent {
	constructor() {
		super();
		this.state = {
			username: "",
			password: "",
		};
		document.title = "oculaire - logowanie";
		this.handleSubmit = this.handleSubmit.bind(this);
		this.generateChangeHandler = this.generateChangeHandler.bind(this);
	}

	componentDidMount() {
		return axios.get("/api/v1/users/me").then(resp => {
			alert("Jesteś już zalogowany/a!");
			document.location = "/app";
		});
	}

	generateChangeHandler(name) {
		return e => this.setState({ [name]: e.target.value });
	}

	handleSubmit(e) {
		e.preventDefault();
		return handle_login(this.state);
	}
	render() {
		return (
			<section className="auth-section">
				<h2 className="auth-section__header">Zaloguj się</h2>
				<form
					action="post"
					onSubmit={this.handleSubmit}
					className="auth-section__form"
				>
					<label
						className="auth-section__form__label auth-section__form__label--far-from-header"
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

					<label
						className="auth-section__form__label"
						htmlFor="password"
					>
						Hasło:
					</label>
					<input
						className="auth-section__form__input"
						value={this.state.password}
						onChange={this.generateChangeHandler("password")}
						name="password"
						type="password"
						placeholder="trudne-do-złamania"
						required
					/>

					<button className="auth-section__form__button">
						Zaloguj się
					</button>
					<div className="auth-section__form__help">
						<Link
							className="auth-section__form__help__link"
							to="password-reset-intent"
						>
							Nie pamiętasz hasła?
						</Link>
					</div>
				</form>
			</section>
		);
	}
}
