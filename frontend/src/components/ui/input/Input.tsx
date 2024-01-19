import {InputHTMLAttributes, useState} from "react";
import {FieldErrors, FieldValues, UseFormRegister, UseFormWatch} from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	elementId: string;
	elementLabel: string;
	elementInputType: "text" | "number" | "password" | "email";
	elementHookFormRegister?: UseFormRegister<FieldValues>;
	elementHookFormErrors?: FieldErrors<FieldValues>;
	elementHookFormWatch?: UseFormWatch<FieldValues>;
	elementHookFormWatchField?: string;
	elementIsRequired?: boolean;
	elementInputMinLength?: number;
	elementInputMaxLength?: number;
	elementIsPassword?: boolean;
	elementIsTextarea?: boolean;
	elementTextareaRows?: number;
	elementWidth?: "auto" | "full";
}
type ValidationType = {
	required?: string;
	minLength?: {value: number; message: string};
	maxLength?: {value: number; message: string};
	validate?: {[key: string]: (val: string) => string | undefined};
};

/**
 * @description Returns a JSX input component
 *
 * Required
 * @param {string} elementId ID of the input
 * @param {string} elementLabel Label of the input
 * @param {"text" | "number" | "password" | "email"} elementInputType Type of the input
 *
 * Optional
 * @param {UseFormRegister<FieldValues>} elementHookFormRegister Hook form register
 * @param {FieldErrors<FieldValues>} elementHookFormErrors Hook form errors
 * @param {UseFormWatch<FieldValues>} elementHookFormWatch Hook form watch
 * @param {string} elementHookFormWatchField Hook form watch field
 * @param {boolean} elementIsRequired Is the input required
 * @param {number} elementInputMinLength Minimum length of the input
 * @param {number} elementInputMaxLength Maximum length of the input
 * @param {boolean} elementIsPassword Is the input a password
 * @param {boolean} elementIsTextarea Is the input a textarea
 * @param {number} elementTextareaRows Number of rows for the textarea
 * @param {"auto" | "full"} elementWidth Width of the input
 *
 * @returns Input component
 */
export default function InputField({
	elementHookFormErrors: errors,
	elementId: id,
	elementWidth: width,
	elementInputType: inputType,
	elementLabel: label,
	elementIsPassword: isPassword,
	elementIsTextarea: isTextarea,
	elementTextareaRows: textareaSize,
	elementHookFormRegister: register,
	elementInputMinLength: minLength,
	elementIsRequired: isRequired,
	elementInputMaxLength: maxLength,
	elementHookFormWatch: watch,
	elementHookFormWatchField: watchField,
	...rest
}: InputProps) {
	const [showPassword, setShowPassword] = useState(false);

	const validation: ValidationType = {};
	if (isRequired) {
		validation["required"] = "This field is required";
	}
	if (minLength) {
		validation["minLength"] = {
			value: minLength,
			message: "Value should have atleast " + minLength + " characters",
		};
	}
	if (maxLength) {
		validation["maxLength"] = {
			value: maxLength,
			message: "Value cannot be longer than " + maxLength + " characters",
		};
	}
	if (watch && watchField) {
		validation["validate"] = {
			checkSame: (val: string) => {
				if (watch(watchField) != val) {
					return "Your passwords do no match";
				}
			},
		};
	}
	if (isPassword) {
		validation["validate"] = {
			...validation["validate"],
			passwordComplexity: (val: string) => {
				if (isPassword && !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#%^~,&$*])/.test(val)) {
					return "Your password needs to have atleast one lowercase, one uppercase, one number and one special character (~!@#$%^&*).";
				}
			},
		};
	}

	const styling =
		"block w-full border px-3 py-1.5 rounded-md focus-visible:outline" +
		" outline-primary-200 outline-[3px] focus-visible:border-primary-500" +
		" hover:outline transition:all disabled:bg-blue-50 disabled:text-gray-500" +
		(errors && errors[id]
			? " border-red-700 bg-red-50/30 focus-visible:bg-white"
			: " border-gray-300 bg-white");

	return (
		<div className="my-2 mx-px">
			<label className="block text-gray-600 text-sm py-1.5" htmlFor={id}>
				{label}{" "}
				{validation.required && (
					<span className="text-red-500 font-bold" title="Required">
						*
					</span>
				)}
			</label>
			<div
				className={"relative" + (width && width === "full" ? " w-full" : " w-full max-w-[20rem]")}
			>
				{isTextarea ? (
					<textarea
						className={styling}
						aria-invalid={errors && errors[id] ? "true" : "false"}
						rows={textareaSize || 2}
						id={id}
						{...(register && register(id, validation))}
						defaultValue={rest["defaultValue"]}
					/>
				) : (
					<input
						aria-invalid={errors && errors[id] ? "true" : "false"}
						className={styling}
						type={showPassword ? "text" : inputType}
						id={id}
						{...(register && register(id, validation))}
						{...rest}
					/>
				)}
				{inputType === "password" && (
					<button
						title={showPassword ? "Hide" : "Show"}
						className="absolute right-0 top-0 bottom-0 p-2.5 z-[4]"
						onClick={(e) => {
							e.preventDefault();
							setShowPassword((val) => !val);
						}}
						type="button"
					>
						<span
							className={
								"ic" +
								(showPassword ? " ic-visibility-off ic-gray-75" : " ic-visibility ic-gray-25")
							}
						></span>
					</button>
				)}
			</div>
			{errors && errors[id] && (
				<p className="text-red-700 text-bb my-1.5 leading-5">{errors[id]?.message?.toString()}</p>
			)}
		</div>
	);
}
