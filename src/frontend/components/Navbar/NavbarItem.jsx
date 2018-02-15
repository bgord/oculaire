import React, { PureComponent } from "react";
import { NavLink } from "react-router-dom";

module.exports = ({
	show_collapsed,
	hide_items,
	path,
	child,
	extra_item_class = "",
	extra_link_class = "",
}) => (
	<li
		className={`navigation__list__item ${extra_item_class} ${
			show_collapsed ? "navigation__list__item--display-collapsed" : ""
		}`}
		onClick={hide_items}
	>
		<NavLink
			className={`navigation__list__item__link ${extra_link_class}`}
			to={path}
		>
			{child}
		</NavLink>
	</li>
);
