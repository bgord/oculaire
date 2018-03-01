import React from "react";
import classnames from "classnames";

export default ({ char, is_blocked, handleClick }) => (
	<div
		className={classnames({
			arrow: true,
			"arrow--blocked": is_blocked,
			"arrow--right": char === ">",
		})}
		onClick={handleClick}
	>
		{char}
	</div>
);
