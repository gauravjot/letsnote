import {UserContext} from "@/App";
import Button from "@/components/ui/button/Button";
import InputField from "@/components/ui/input/Input";
import {ChangeEmailType, changeEmail} from "@/services/user/change_email";
import {ChangeUserNameType, changeName} from "@/services/user/change_user_name";
import {resendVerificationEmail} from "@/services/user/resend_verification_email";
import {datePretty, dateTimePretty, timeSince} from "@/utils/DateTimeUtils";
import {handleAxiosError} from "@/utils/HandleAxiosError";
import {AxiosError} from "axios";
import {useState, useContext, useEffect} from "react";
import {useForm} from "react-hook-form";
import {useMutation} from "react-query";

export default function AccountSettings() {
	const userContext = useContext(UserContext);
	const [showNameChange, setShowNameChange] = useState(false);
	const [showEmailChange, setShowEmailChange] = useState(false);

	const [changeNameError, setChangeNameError] = useState<string | null>(null);
	const changeNameForm = useForm();
	const changeNameMutation = useMutation({
		mutationFn: (payload: ChangeUserNameType) => {
			return userContext && userContext.user
				? changeName(payload)
				: Promise.reject("User authentication error. Logout and login again to retry.");
		},
		onSuccess: (res) => {
			const response = res.data;
			if (userContext.user) {
				userContext.setUser({
					user: response,
					session: userContext.user.session,
				});
				setShowNameChange(false);
				setChangeNameError(null);
			}
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setChangeNameError);
		},
	});

	const [changeEmailError, setChangeEmailError] = useState<string | null>(null);
	const changeEmailForm = useForm();
	const changeEmailMutation = useMutation({
		mutationFn: (payload: ChangeEmailType) => {
			return userContext && userContext.user
				? changeEmail(payload)
				: Promise.reject("User authentication error. Logout and login again to retry.");
		},
		onSuccess: (res) => {
			if (userContext.user) {
				userContext.setUser({
					user: res.user,
					session: userContext.user.session,
				});
				setShowEmailChange(false);
				setChangeEmailError(null);
				setVerifyEmailResendError(null);
			}
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setChangeEmailError);
		},
	});

	const [verifyEmailResendError, setVerifyEmailResendError] = useState<string | null>(null);
	const verifyEmailResendMutation = useMutation({
		mutationFn: () => {
			return userContext && userContext.user && !userContext.user.user.verified
				? resendVerificationEmail()
				: Promise.reject("User is already verified.");
		},
		onSuccess: () => {
			setVerifyEmailResendError(null);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setVerifyEmailResendError);
		},
	});

	useEffect(() => {
		if (verifyEmailResendError && verifyEmailResendError.toLowerCase().includes("verified")) {
			const u = userContext.user;
			if (u?.user) {
				u.user.verified = true;
				userContext?.setUser(u);
				setVerifyEmailResendError(null);
			}
		}
	}, [verifyEmailResendError, userContext]);

	return (
		<>
			<h2 id="account-settings" className="pt-7 pb-2">
				Account
			</h2>
			<p className="text-gray-500 font-normal">Manage your profile</p>

			{/** Name */}
			<div className="my-8 pr-4">
				<h3 className="text-bb font-medium py-px text-gray-800 border-b">Full Name</h3>

				{changeNameError && <p className="mx-4 mt-4 text-red-700 text-sm">{changeNameError}</p>}

				{showNameChange ? (
					<form
						className="mx-4"
						onSubmit={changeNameForm.handleSubmit((d) => {
							changeNameMutation.mutate(JSON.parse(JSON.stringify(d).replaceAll("as-", "")));
						})}
					>
						<fieldset disabled={changeNameMutation.isLoading}>
							<InputField
								elementId="as-name"
								elementInputType="text"
								elementLabel="Enter new name"
								defaultValue={userContext?.user?.user.name}
								elementInputMinLength={2}
								elementInputMaxLength={64}
								elementIsRequired={true}
								elementHookFormRegister={changeNameForm.register}
								elementHookFormErrors={changeNameForm.formState.errors}
							/>
							<div className="flex gap-2">
								<Button
									elementChildren="Save"
									elementState={
										changeNameMutation.isLoading
											? "loading"
											: changeNameMutation.isSuccess
											? "done"
											: "default"
									}
									elementStyle="primary"
									elementType="submit"
									elementSize="small"
								/>
								<Button
									elementChildren="Cancel"
									elementState="default"
									elementStyle="white_no_border"
									elementType="button"
									elementSize="small"
									onClick={() => setShowNameChange(false)}
								/>
							</div>
						</fieldset>
					</form>
				) : (
					<>
						<p className="mt-3 mx-4 text-gray-900 tracking-wide">{userContext?.user?.user.name}</p>
						{changeNameMutation.isSuccess && (
							<p className="mx-4 mt-2 text-green-700 text-sm">Name changed successfully.</p>
						)}
						<div className="mx-4 mt-1">
							<Button
								elementChildren="Change your name"
								elementState="default"
								elementStyle="primary_text_opaque"
								elementInvert={true}
								elementSize="xsmall"
								elementType="button"
								elementIcon="ic-edit"
								onClick={() => {
									setShowNameChange(true);
									changeNameMutation.reset();
								}}
							/>
						</div>
					</>
				)}
			</div>

			{/** Email */}
			<div className="my-8 pr-4">
				<h3 className="text-bb font-medium py-px text-gray-800 border-b">Email address</h3>

				{changeEmailError && <p className="mx-4 mt-4 text-red-700 text-sm">{changeEmailError}</p>}

				{showEmailChange ? (
					<form
						className="mx-4"
						onSubmit={changeEmailForm.handleSubmit((d) => {
							changeEmailMutation.mutate(JSON.parse(JSON.stringify(d).replaceAll("as-", "")));
						})}
					>
						<fieldset disabled={changeEmailMutation.isLoading}>
							<InputField
								elementId="as-email"
								elementInputType="email"
								elementLabel="Enter new email address"
								defaultValue={userContext?.user?.user.email}
								elementInputMinLength={5}
								elementInputMaxLength={256}
								elementIsRequired={true}
								elementHookFormRegister={changeEmailForm.register}
								elementHookFormErrors={changeEmailForm.formState.errors}
							/>
							<InputField
								elementId="as-password"
								elementInputType="password"
								elementLabel="Enter your password"
								elementIsRequired={true}
								elementHookFormRegister={changeEmailForm.register}
								elementHookFormErrors={changeEmailForm.formState.errors}
							/>
							<div className="flex gap-2">
								<Button
									elementChildren="Save"
									elementState={
										changeEmailMutation.isLoading
											? "loading"
											: changeEmailMutation.isSuccess
											? "done"
											: "default"
									}
									elementStyle="primary"
									elementType="submit"
									elementSize="small"
								/>
								<Button
									elementChildren="Cancel"
									elementState="default"
									elementStyle="white_no_border"
									elementType="button"
									elementSize="small"
									onClick={() => setShowEmailChange(false)}
								/>
							</div>
						</fieldset>
					</form>
				) : (
					<>
						<p className="mt-3 mx-4 text-gray-900 tracking-wide">
							{userContext?.user?.user.email}
							{"  "}
							{userContext.user?.user.verified ? (
								<span className="ml-2 font-medium text-green-700 bg-green-100 rounded px-1.5 py-px tracking-tight text-bb">
									Verified
								</span>
							) : (
								<>
									<span className="ml-2 font-medium text-red-600 bg-red-100 rounded px-1.5 py-px inline-block tracking-tight text-bb">
										Not Verified
									</span>
									<br />
									{!verifyEmailResendMutation.isSuccess ? (
										<>
											{verifyEmailResendError && (
												<p className="mt-2 text-red-600 text-sm">{verifyEmailResendError}</p>
											)}
											<Button
												elementChildren="Resend Verification Email"
												elementState={verifyEmailResendMutation.isLoading ? "loading" : "default"}
												elementStyle="primary_text_opaque"
												elementType="button"
												elementSize="small"
												onClick={() => {
													verifyEmailResendMutation.mutate();
												}}
											/>
										</>
									) : (
										<p className="mt-2 font-medium text-green-700 text-sm">
											Verification email sent successfully. If you don't see the email, check your
											spam or junk folder.
										</p>
									)}
								</>
							)}
						</p>
						{changeEmailMutation.isSuccess && (
							<p className="mx-4 mt-2 text-green-700 text-sm">
								Email changed successfully.{" "}
								<span className="font-medium">
									Please verify your new email address by clicking the link sent to your new email
									address.
								</span>
							</p>
						)}
						<div className="mx-4 mt-1">
							<Button
								elementChildren="Change email address"
								elementState="default"
								elementStyle="primary_text_opaque"
								elementInvert={true}
								elementSize="xsmall"
								elementType="button"
								elementIcon="ic-edit"
								onClick={() => {
									setShowEmailChange(true);
									changeEmailMutation.reset();
								}}
							/>
						</div>
					</>
				)}
			</div>

			<div className="my-8 pr-4">
				<h3 className="text-bb font-medium py-px text-gray-800 border-b">Other details</h3>
				{userContext.user && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
						<div>
							<h4 className="text-bb font-medium">User ID</h4>
							<p className="mt-1 text-gray-600 text-bb">{userContext.user.user.id}</p>
						</div>
						<div>
							<h4 className="text-bb font-medium">Joined Letsnote</h4>
							<p className="mt-1 text-gray-600 text-bb">
								{datePretty(userContext.user.user.created)}
							</p>
						</div>
						<div>
							<h4 className="text-bb font-medium">Profile last modified</h4>
							<p className="mt-1 text-gray-600 text-bb">
								{dateTimePretty(userContext.user.user.updated)}
							</p>
						</div>
						<div>
							<h4 className="text-bb font-medium">Password last changed</h4>
							<p className="mt-1 text-gray-600 text-bb">
								{timeSince(userContext.user.user.password_updated)}
							</p>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
