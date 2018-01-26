import axios from "axios";
import { parse } from "query-string";

module.exports = body =>
	axios
		.post("/api/v1/sessions", body)
		.then(() => {
			const { redirect } = parse(location.search);
			document.location = redirect ? redirect : "/app";
		})
		.catch(e => {
			const msg =
				e.response.data.type === "invalid_credentials"
					? "Nieprawidłowy login lub hasło."
					: "Wystąpił błąd.";
			alert(msg);
		});
