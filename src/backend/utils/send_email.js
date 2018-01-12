const nodemailer = require("nodemailer");

const to_plaintext = html => html.replace(/<[^>]*>/g, "");

module.exports = (nodemailer_config, scenario) => {
	const transporter = nodemailer.createTransport(nodemailer_config);
	const mail_options = {
		from: "oculaire.com",
		to: scenario.to,
		subject: scenario.subject,
		html: scenario.html,
		text: to_plaintext(scenario.html),
	};

	if (process.env.NODE_ENV === "TEST") {
		console.log(`TEST ENVIRONMENT. \nThis email would be sent: \n `);
		console.log(mail_options);
	} else {
		console.log(`Sending email to: ${mail_options.to}`);
		return transporter.sendMail(mail_options).then(console.log);
	}
};
