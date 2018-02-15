import React from "react";
import LOGO from "./navbar_logo.png";

module.exports = {
	"logged-in": [
		{
			path: "/app",
			extra_item_class: "navigation__list__item--logo",
			extra_link_class: "navigation__list__item__link--logo",
			child: (
				<img
					src={LOGO}
					className="navigation__list__item__link__logo"
				/>
			),
		},
		{
			path: "/app/journal?day=today",
			child: "Dziennik",
		},
		{
			path: "/app/stats",
			child: "Statystyki",
		},
		{
			path: "/app/settings",
			child: "Ustawienia",
		},
		{
			path: "/logout",
			child: "Wyloguj się",
		},
	],
	"logged-out": [
		{
			path: "/",
			extra_item_class: "navigation__list__item--logo",
			extra_link_class: "navigation__list__item__link--logo",
			child: (
				<img
					src={LOGO}
					className="navigation__list__item__link__logo"
				/>
			),
		},
		{
			path: "/FAQ",
			child: "FAQ",
		},
		{
			path: "/register",
			child: "Załóż konto",
		},
		{
			path: "/login",
			child: "Zaloguj się",
		},
	],
};
