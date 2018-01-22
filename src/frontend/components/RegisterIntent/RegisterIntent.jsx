import React, { PureComponent } from "react";
import axios from "axios";

export default class RegisterIntent extends PureComponent {
	constructor() {
		super();
		this.state = {
			e_mail: "",
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		document.title = "oculaire - rejestracja";
	}
	handleChange(e) {
		this.setState({ e_mail: e.target.value });
	}
	handleSubmit(e) {
		e.preventDefault();
		if (!this.state.e_mail) {
			alert("Błędny email!");
		} else {
			return axios
				.post("/api/v1/registration-intent", {
					e_mail: this.state.e_mail,
				})
				.then(resp => {
					alert(resp.data.content);
					document.location = "/";
				})
				.catch(e => {
					const err_msg = e.response.data.message;
					alert(err_msg.content);
					if (err_msg.type !== "email-failed") {
						this.setState({ e_mail: "" });
					}
				});
		}
	}
	render() {
		return (
			<section className="auth-section">
				<h2 className="auth-section__header">Zarejestruj się</h2>
				<form
					action="post"
					onSubmit={this.handleSubmit}
					className="auth-section__form"
				>
					<label
						className="auth-section__form__label auth-section__form__label--far-from-input auth-section__form__label--far-from-header"
						htmlFor="e_mail"
					>
						Email:
					</label>
					<input
						autoFocus
						className="auth-section__form__input"
						value={this.state.e_mail}
						onChange={this.handleChange}
						name="e_mail"
						type="email"
						placeholder="imie.nazwisko@domena.pl"
						required
					/>
					<button className="auth-section__form__button">
						Potwierdź email
					</button>
				</form>
			</section>
		);
	}
}
