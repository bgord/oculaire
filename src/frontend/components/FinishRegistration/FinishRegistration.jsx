import React, { PureComponent } from "react";
import axios from "axios";
import qs from "query-string";

const ENG_TO_PLN = {
	token: "token",
	username: "nazwa użytkownika",
	password: "hasło",
	gender: "zaimek",
	goal: "cel",
};

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
	}
	componentWillMount() {
		const { token } = qs.parse(location.search);
		if (!token) {
			alert("Niepoprawny link!");
			document.location = "/";
		} else this.setState({ token });
	}

	generateChangeHandler(name) {
		return e => this.setState({ [name]: e.target.value });
	}

	handleSubmit(e) {
		e.preventDefault();
		if (this.state.gender === "choose-gender") {
			alert("Wybierz swój preferowany zaimek.");
		} else
			return axios
				.post("/api/v1/finish-registration", this.state)
				.then(resp => {
					alert(resp.data.content);
					document.location = "/login";
				})
				.catch(e => {
					let {
						content,
						type,
						additional_info,
					} = e.response.data.message;
					if (type === "missing-param") {
						content += `${additional_info
							.map(param => ENG_TO_PL[param])
							.join(", ")}!`;
					}
					alert(content);
					if (type === "wrong-token") {
						document.location = "/register";
					}
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
						Cel kcal/dzień:
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
