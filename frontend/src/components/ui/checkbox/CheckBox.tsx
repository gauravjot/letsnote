import {FieldErrors, FieldValues, UseFormRegister} from "react-hook-form";

export interface ICheckBoxProps {
	elementId: string;
	elementLabel: string;
	elementHookFormRegister?: UseFormRegister<FieldValues>;
	elementHookFormErrors?: FieldErrors<FieldValues>;
	elementIsRequired?: boolean;
}

export default function CheckBox({
	elementHookFormErrors: errors,
	elementId: id,
	elementLabel: label,
	elementHookFormRegister: register,
	elementIsRequired: isRequired,
	...rest
}: ICheckBoxProps) {
	return (
		<div className="my-4 flex place-items-center">
			<label
				className="select-none cursor-pointer text-sm text-gray-700 pl-0.5 pr-2"
				htmlFor="consent"
			>
				{errors && errors["consent"] && (
					<span className="text-red-600">
						{errors["consent"].message?.toString()}
						{": "}
					</span>
				)}
				{label} {isRequired && <span className="text-red-600">*</span>}
			</label>
			<input
				className="cursor-pointer"
				id="consent"
				type="checkbox"
				{...(register && register("consent", {required: "Please confirm"}))}
				{...rest}
			/>
		</div>
	);
}
