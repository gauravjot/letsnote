import React from "react";
import Spinner from "@/components/ui/spinner/Spinner";

/**
 * Required
 * @param {string} elementChildren Text inside the button
 * @param {"primary" | "black" | "danger" | "white_opaque" | "no_border_opaque" | "border_opaque"} elementStyle Style of the button
 * @param {"default" | "loading" | "done"} elementState State of the button
 * @param {"button" | "submit" | "reset"} elementType Type of the button
 *
 * Optional
 * @param {"xsmall" | "small" | "base" | "large"} elementSize Size of the button
 * @param {boolean} elementInvert Invert the button
 * @param {boolean} elementDisabled Disable the button
 * @param {"auto" | "full"} elementWidth Width of the button
 * @param {string} elementIcon Icon of the button: "ic-name>"
 */
interface Props {
	onClick?: () => void;
	elementChildren: React.ReactNode;
	elementStyle:
		| "primary"
		| "black"
		| "danger"
		| "primary_text_opaque"
		| "white_no_border"
		| "white_border";
	elementState: "default" | "loading" | "done";
	elementType: "button" | "submit" | "reset";
	elementSize?: "xsmall" | "small" | "base" | "large";
	elementIconSize?: "xs" | "sm" | "md" | "base" | "lg";
	elementIconOnly?: boolean;
	elementInvert?: boolean;
	elementDisabled?: boolean;
	elementWidth?: "auto" | "full";
	elementIcon?: string;
}

const buttonBaseStyle =
	"my-1 leading-[1] shadow font-bold rounded-md pointer hover:outline focus:outline focus:outline-4 hover:outline-4 disabled:outline-0 disabled:opacity-50";

/**
 * @description Returns a JSX button component
 *
 * @param {Props} props Props needed to render the button
 * @returns Button component
 */
export default function Button(props: Props) {
	const style = {
		primary: props.elementInvert
			? "border border-primary-600 text-primary-600 outline-primary-600/20 focus:bg-primary-50"
			: "bg-primary-600 text-white outline-primary-600/20 focus:bg-primary-700/90",
		black: props.elementInvert
			? "border border-gray-600 text-gray-700 outline-gray-200 focus:bg-gray-50"
			: "bg-gray-900 text-white outline-gray-300 focus:bg-gray-800",
		danger: props.elementInvert
			? "border border-red-600 text-red-600 outline-red-200 focus:bg-red-50"
			: "bg-red-600 text-white outline-red-200 focus:bg-red-700",
		white_no_border:
			"border border-transparent shadow-none font-normal text-gray-700 outline-transparent hover:bg-gray-200 focus:bg-gray-200",
		white_border:
			"border border-gray-300 text-gray-700 hover:outline-gray-200 hover:border-gray-400 focus:outline-gray-200 focus:bg-gray-50",
		primary_text_opaque:
			"text-primary-700 font-medium bg-white border-none shadow-none hover:outline-none hover:bg-primary-50 focus:bg-primary-50",
	};
	const buttonSizing =
		props.elementSize === "base"
			? "text-bb py-1.5 px-4"
			: props.elementSize === "xsmall"
			? "text-[0.8rem] py-px px-1.5"
			: props.elementSize === "small"
			? "text-sm py-0.5 px-3"
			: props.elementSize === "large"
			? "text-base py-2.5 px-6"
			: "text-bb py-1.5 px-4";
	const buttonWidth = props.elementWidth === "full" ? "w-full" : "";

	const iconColor =
		(props.elementInvert && props.elementStyle === "primary") ||
		props.elementStyle === "primary_text_opaque"
			? "primary"
			: props.elementInvert && props.elementStyle === "danger"
			? "danger"
			: props.elementInvert && props.elementStyle === "black"
			? "black"
			: props.elementStyle === "white_border" || props.elementStyle === "white_no_border"
			? "black"
			: "white";

	return (
		<button
			onClick={props.onClick}
			className={
				buttonBaseStyle +
				" " +
				style[props.elementStyle] +
				" " +
				buttonSizing +
				" " +
				buttonWidth +
				(props.elementIconOnly ? " aspect-square" : "")
			}
			disabled={props.elementDisabled}
		>
			{props.elementState === "default" ? (
				<span className="h-7 flex gap-1.5 place-items-center justify-center">
					{props.elementIcon && (
						<span
							className={` ic ${
								props.elementIconSize ? "ic-" + props.elementIconSize : ""
							} ic-${props.elementIcon.replace("ic-", "")} ${"ic-" + iconColor} align-bottom`}
						></span>
					)}
					{props.elementIconOnly ? <></> : props.elementChildren}
				</span>
			) : props.elementState === "loading" ? (
				<Spinner size="sm" color={iconColor} />
			) : (
				<span className={"ic ic-lg ic-done " + "ic-" + iconColor}></span>
			)}
		</button>
	);
}
