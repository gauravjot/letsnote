import React, {useState} from "react";
import {userLogin, UserLoginInfo} from "@/services/user/log_in_out";
import {UserContext} from "@/App";
import {useForm} from "react-hook-form";
import {AxiosError} from "axios";
import {handleAxiosError} from "@/utils/HandleAxiosError";
import InputField from "@/components/ui/input/Input";
import Button from "@/components/ui/button/Button";
import {useMutation} from "react-query";
import {UserType} from "@/types/user";

export default function Login({
	switchToRegister,
	switchToForgotPassword,
}: {
	switchToRegister?: React.Dispatch<React.SetStateAction<boolean>>;
	switchToForgotPassword?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const userContext = React.useContext(UserContext);

	const [error, setError] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		reset,
		formState: {errors},
	} = useForm();

	const mutation = useMutation({
		mutationFn: (payload: UserLoginInfo) => {
			return userLogin(payload);
		},
		onSuccess: (data: UserType) => {
			setError(null);
			reset();
			userContext.setUser(data);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setError);
		},
	});

	return (
		<div className="my-3 mt-6 pb-4 px-4 border-b border-gray-300 shadow-smb">
			<div>
				<h2>Sign-in</h2>
				<p className="text-gray-600 text-sm mb-2 mt-1">Write your documents and edit later.</p>
			</div>
			{error && (
				<div className="text-sm text-red-700/80 bg-red-50 rounded px-3 mb-2 mt-4 font-medium py-2">
					{error}
				</div>
			)}
			<form
				onSubmit={handleSubmit((d) => {
					mutation.mutate(JSON.parse(JSON.stringify(d).replaceAll("loginform_", "")));
				})}
			>
				<fieldset disabled={mutation.isLoading}>
					<InputField
						elementId="loginform_email"
						elementLabel="Email"
						elementInputType="email"
						elementHookFormErrors={errors}
						elementHookFormRegister={register}
						elementIsRequired={true}
						elementWidth="full"
					/>
					<InputField
						elementId="loginform_password"
						elementLabel="Password"
						elementInputType="password"
						elementHookFormErrors={errors}
						elementHookFormRegister={register}
						elementIsRequired={true}
						elementWidth="full"
					/>
					<Button
						elementState={mutation.isLoading ? "loading" : mutation.isSuccess ? "done" : "default"}
						elementStyle="primary"
						elementSize="base"
						elementChildren="Login"
						elementType="submit"
					/>
				</fieldset>
			</form>
			{switchToForgotPassword && (
				<p className="text-bb text-gray-600 mt-3">
					<button
						className="text-primary-700 hover:underline font-medium"
						onClick={() => switchToForgotPassword(true)}
					>
						Forgot Password?
					</button>
				</p>
			)}
			{switchToRegister && (
				<p className="text-bb text-gray-600 mt-1.5">
					Don't have an account?{" "}
					<button
						className="text-primary-700 hover:underline font-medium"
						onClick={() => switchToRegister(true)}
					>
						Register now
					</button>
				</p>
			)}
		</div>
	);
}
