import {UserContext} from "@/App";
import Button from "@/components/ui/button/Button";
import InputField from "@/components/ui/input/Input";
import {UserRegisterInfo, UserRegisterResponse, userRegister} from "@/services/user/register";
import {handleAxiosError} from "@/utils/HandleAxiosError";
import {AxiosError} from "axios";
import React from "react";
import {useForm} from "react-hook-form";
import {useMutation} from "react-query";

export default function Register({
	showRegister,
}: {
	showRegister?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const userContext = React.useContext(UserContext);

	const [error, setError] = React.useState<string | null>(null);
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: {errors},
	} = useForm();

	const mutation = useMutation({
		mutationFn: (payload: UserRegisterInfo) => {
			return userRegister(payload);
		},
		onSuccess: (data: UserRegisterResponse) => {
			setError(null);
			reset();
			userContext.setUser(data);
			showRegister && showRegister(false);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setError);
		},
	});

	return (
		<div className="my-3 mt-6 pb-4 px-4 border-b border-gray-300 shadow-smb">
			<div>
				<h2>Register</h2>
				<p className="text-gray-600 text-sm mb-2 mt-1">Write your documents and edit later.</p>
			</div>
			{error && (
				<div className="text-sm text-red-700/80 bg-red-50 rounded px-3 mb-2 mt-4 font-medium py-2">
					{error}
				</div>
			)}
			<form
				onSubmit={handleSubmit((d) => {
					mutation.mutate(JSON.parse(JSON.stringify(d).replaceAll("registerform_", "")));
				})}
			>
				<fieldset disabled={mutation.isLoading}>
					<InputField
						elementId="registerform_name"
						elementLabel="Name"
						elementInputType="text"
						elementInputMinLength={3}
						elementInputMaxLength={64}
						elementHookFormErrors={errors}
						elementHookFormRegister={register}
						elementIsRequired={true}
						elementWidth="full"
					/>
					<InputField
						elementId="registerform_email"
						elementLabel="Email"
						elementInputType="email"
						elementHookFormErrors={errors}
						elementHookFormRegister={register}
						elementIsRequired={true}
						elementWidth="full"
					/>
					<InputField
						elementId="registerform_password"
						elementLabel="Password"
						elementInputType="password"
						elementHookFormErrors={errors}
						elementHookFormRegister={register}
						elementIsRequired={true}
						elementIsPassword={true}
						elementWidth="full"
					/>
					<InputField
						elementId="registerform_confirm_password"
						elementLabel="Confirm Password"
						elementInputType="password"
						elementHookFormWatch={watch}
						elementHookFormWatchField="registerform_password"
						elementHookFormErrors={errors}
						elementHookFormRegister={register}
						elementIsRequired={true}
						elementWidth="full"
					/>
					<Button
						elementState={mutation.isLoading ? "loading" : mutation.isSuccess ? "done" : "default"}
						elementStyle="primary"
						elementSize="base"
						elementChildren="Register"
						elementType="submit"
					/>
				</fieldset>
			</form>
			{showRegister && (
				<p className="text-bb text-gray-600 mt-3">
					Already have an account?{" "}
					<button
						className="text-primary-700 hover:underline font-medium"
						onClick={() => showRegister(false)}
					>
						Login here
					</button>
				</p>
			)}
		</div>
	);
}
