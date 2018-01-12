module.exports = {
	"email-confirmation": (intent, link) => ({
		to: intent.body.e_mail,
		subject: "Potwierdzenie adresu e-mail",
		html: `W celu potwierdzenia adresu e-mail kliknij tutaj <a href="${link}">${link}</a>`,
	}),
};
