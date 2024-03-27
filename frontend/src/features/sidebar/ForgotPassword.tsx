import Button from "@/components/ui/button/Button";
import InputField from "@/components/ui/input/Input";
import {ForgotPasswordType, forgotPassword} from "@/services/user/forgot_password";
import {handleAxiosError} from "@/utils/HandleAxiosError";
import {AxiosError} from "axios";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {useMutation} from "react-query";

export function ForgotPassword({
	switchToForgotPassword,
}: {
	switchToForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [error, setError] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm();
	const mutation = useMutation({
		mutationFn: (payload: ForgotPasswordType) => forgotPassword(payload),
		onSuccess: () => {
			setError(null);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setError);
		},
	});
	return (
		<div className="my-3 mt-6 pb-4 px-4 border-b border-gray-300 shadow-smb">
			{mutation.isSuccess ? (
				<div>
					<h2>Forgot Password</h2>
					<p className="text-gray-600 text-sm mb-2 mt-1">
						An email has been sent to your email address. Use the link to reset your password.
					</p>
					<p className="text-bb text-gray-600 mt-3">
						<button
							className="text-primary-700 hover:underline font-medium"
							onClick={() => mutation.reset()}
						>
							Entered incorrect email?
						</button>
					</p>
				</div>
			) : (
				<>
					<div>
						<h2>Forgot Password</h2>
						<p className="text-gray-600 text-sm mb-2 mt-1">
							Enter your email and we will send a reset link.
						</p>
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
								elementId="registerform_email"
								elementLabel="Email"
								elementInputType="email"
								elementHookFormErrors={errors}
								elementHookFormRegister={register}
								elementIsRequired={true}
								elementWidth="full"
							/>
							<Button
								elementState={
									mutation.isLoading ? "loading" : mutation.isSuccess ? "done" : "default"
								}
								elementStyle="primary"
								elementSize="base"
								elementChildren="Register"
								elementType="submit"
							/>
						</fieldset>
					</form>
				</>
			)}
			<p className="text-bb text-gray-600 mt-3">
				<button
					className="text-primary-700 hover:underline font-medium"
					onClick={() => switchToForgotPassword(false)}
				>
					Back to Login
				</button>
			</p>
		</div>
	);
}
