import React, { PureComponent } from "react";
import login_status_to_nav_items from "./login_status_to_nav_items";
import NavbarItem from "./NavbarItem";
import ToggleButton from "./ToggleButton";

export default class Navbar extends PureComponent {
	constructor() {
		super();
		this.state = {
			show_collapsed: false,
		};
		this.toggle_collapse_navbar = this.toggle_collapse_navbar.bind(this);
		this.hide_items = this.hide_items.bind(this);
	}
	toggle_collapse_navbar() {
		this.setState({ show_collapsed: !this.state.show_collapsed });
	}
	hide_items() {
		this.setState({ show_collapsed: false });
	}
	render() {
		const current_nav_items =
			login_status_to_nav_items[
				this.props.is_logged_in ? "logged-in" : "logged-out"
			];
		const Navigation = current_nav_items.map(nav_item => (
			<NavbarItem
				show_collapsed={this.state.show_collapsed}
				hide_items={this.hide_items}
				{...nav_item}
			/>
		));
		return (
			<nav className="navigation">
				<ul className="navigation__list">
					<ToggleButton
						toggle_collapse_navbar={this.toggle_collapse_navbar}
					/>
					{Navigation}
				</ul>
			</nav>
		);
	}
}
