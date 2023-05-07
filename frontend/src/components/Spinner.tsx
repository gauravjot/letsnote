import * as React from "react";

export interface ISpinnerProps {}

export default function Spinner(props: ISpinnerProps) {
	return (
		<div className="w-full my-2 mt-16 text-center">
			<div className="anim-ripple">
				<div></div>
				<div></div>
			</div>
		</div>
	);
}
