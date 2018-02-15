module.exports = {
	"email-confirmation": (intent, link) => ({
		to: intent.body.e_mail,
		subject: "Potwierdzenie adresu e-mail",
		html: `W celu potwierdzenia adresu e-mail kliknij tutaj <a href="${link}">${link}</a>`,
	}),
	"password-reset": (e_mail, link) => ({
		to: e_mail,
		subject: "Zmiana hasła",
		html: `W celu zmiany hasła kliknij tutaj <a href="${link}">${link}</a>. Jeśli to nie Ty wysłałeś to zapytanie, zignoruj je.`,
	}),
};
