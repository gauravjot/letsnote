import Button from "@/components/ui/button/Button";
import InputField from "@/components/ui/input/Input";
import {ResetPasswordType, resetPassword} from "@/services/user/forgot_password";
import {passwordResetHealthCheck} from "@/services/user/forgot_password_health_check";
import {handleAxiosError} from "@/utils/HandleAxiosError";
import {AxiosError} from "axios";
import * as React from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQuery} from "react-query";
import {useParams} from "react-router-dom";

export default function PasswordResetPage() {
	const {token} = useParams();
	const [error, setError] = React.useState<string | null>(null);
	const {
		register,
		handleSubmit,
		watch,
		formState: {errors},
	} = useForm();
	const mutation = useMutation({
		mutationFn: (payload: ResetPasswordType) => resetPassword(payload),
		onSuccess: () => {
			setError(null);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setError);
		},
	});

	// Check health of the reset link
	const healthCheckQuery = useQuery(
		["password_reset_health_check", token],
		() => token && passwordResetHealthCheck(token),
		{
			enabled: !!token,
			retry: false,
			refetchOnWindowFocus: false,
		}
	);

	return (
		<div className="bg-gray-100 min-h-screen">
			<div className="mx-auto flex flex-col place-items-center justify-center min-h-screen">
				<div className="py-5 mx-4 mb-4 w-[32rem] max-w-full">
					<span className="font-sans px-2 font-black tracking-tighter text-black text-[2.75rem]">
						letsnote.io
					</span>
				</div>
				<div className="w-[32rem] max-w-full bg-white p-4 rounded-lg shadow mx-4 h-fit">
					<h1 className="text-2xl font-medium">Reset Password</h1>
					{mutation.isSuccess ? (
						<div className="text-green-700 mt-4">
							<p>Your password has been reset.</p>
							<p className="text-bb text-gray-600 mt-3">
								<button
									className="text-primary-700 hover:underline font-medium"
									onClick={() => {
										window.location.href = "/";
									}}
								>
									Go to Login
								</button>
							</p>
						</div>
					) : healthCheckQuery.isError ? (
						<div className="text-red-600 mt-4">
							<p>
								The reset link has been expired or is invalid. Please use the reset password again.
							</p>
							<p className="text-bb text-gray-600 mt-3">
								<button
									className="text-primary-700 hover:underline font-medium"
									onClick={() => {
										window.location.href = "/";
									}}
								>
									Go to Login
								</button>
							</p>
						</div>
					) : healthCheckQuery.isLoading ? (
						<div className="text-gray-600 mt-4">
							<p>Checking reset link...</p>
						</div>
					) : (
						<div className="mt-2">
							{error && (
								<div className="text-sm text-red-700/80 bg-red-50 rounded px-3 mb-2 mt-4 font-medium py-2">
									{error}
								</div>
							)}
							<form
								onSubmit={handleSubmit((d) => {
									let payload = JSON.parse(JSON.stringify(d).replaceAll("rp_", ""));
									payload.token = token;
									mutation.mutate(payload);
								})}
							>
								<fieldset disabled={mutation.isLoading}>
									<InputField
										elementId="rp_password"
										elementInputType="password"
										elementLabel="Enter new password"
										elementInputMinLength={8}
										elementInputMaxLength={72}
										elementIsRequired={true}
										elementHookFormErrors={errors}
										elementHookFormRegister={register}
										elementWidth="full"
									/>
									<InputField
										elementId="rp_confirm_password"
										elementInputType="password"
										elementLabel="Confirm new password"
										elementInputMinLength={8}
										elementInputMaxLength={72}
										elementIsRequired={true}
										elementHookFormWatch={watch}
										elementHookFormWatchField="rp_password"
										elementHookFormErrors={errors}
										elementWidth="full"
										elementHookFormRegister={register}
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
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
