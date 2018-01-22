import axios from "axios";

module.exports = () =>
	axios
		.delete("/api/v1/sessions/current")
		.then(() => {
			document.location = "/login";
		})
		.catch(e => {
			console.log(e);
			alert("Nie udało się wylogować.");
			document.location = "/app";
		});
