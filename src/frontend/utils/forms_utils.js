import qs from "query-string";
import axios from "axios";
import ENG_TO_PL from "./params_eng_to_pl";

module.exports = {
	confirm_token: ({
		url,
		body,
		redirect_to_after_success,
		redirect_to_after_error,
	}) =>
		axios
			.post(url, body)
			.then(resp => {
				alert(resp.data.content);
				document.location = redirect_to_after_success;
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
					document.location = redirect_to_after_error;
				}
			}),
	require_url_token_to_mount_component: function() {
		const { token } = qs.parse(location.search);
		if (!token) {
			alert("Niepoprawny link!");
			document.location = "/";
		} else this.setState({ token });
	},
};
