import React from "react";
import EmailFormCreator from "../EmailFormCreator/EmailFormCreator";

export default EmailFormCreator({
	title: "oculaire - rejestracja",
	header: "Zarejestruj się",
	button_text: "Potwierdź email",
	post_url: "/api/v1/registration-intent",
	redirect_to: "/",
});
