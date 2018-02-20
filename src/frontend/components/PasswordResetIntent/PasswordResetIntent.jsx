import React from "react";
import EmailFormCreator from "../EmailFormCreator/EmailFormCreator";

export default EmailFormCreator({
	title: "oculaire - reset hasła",
	header: "Zmień hasło",
	button_text: "Wyślij email",
	post_url: "/api/v1/password-reset-intent",
	redirect_to: "/login",
});
