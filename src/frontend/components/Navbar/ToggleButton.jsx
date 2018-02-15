import React from "react";

module.exports = ({ toggle_collapse_navbar }) => (
	<li
		className="navigation__list__item navigation__list__item--toggle"
		onClick={toggle_collapse_navbar}
	>
		<span className="navigation__list__item__link">&#9776;</span>
	</li>
);
