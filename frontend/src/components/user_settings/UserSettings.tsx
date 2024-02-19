import {useContext, useEffect, useState} from "react";
import Button from "../ui/button/Button";
import InputField from "../ui/input/Input";
import {UserContext} from "@/App";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {ChangeUserNameType, changeName} from "@/services/user/change_user_name";
import {UserSessionType, UserType} from "@/types/user";
import {ChangeEmailType, changeEmail} from "@/services/user/change_email";
import {ChangePasswordType, changePassword} from "@/services/user/change_password";
import {getUserSessions} from "@/services/user/get_session_list";
import Spinner from "../ui/spinner/Spinner";
import {timeSince} from "@/utils/TimeSince";
import {RemoveSessionType, closeSession} from "@/services/user/remove_session";
import {useForm} from "react-hook-form";
import {AxiosError} from "axios";
import {handleAxiosError} from "@/utils/HandleAxiosError";
import {UAParser} from "ua-parser-js";

export function UserSettings({closeFn}: {closeFn: () => void}) {
	const userContext = useContext(UserContext);
	const [showNameChange, setShowNameChange] = useState(false);
	const [showEmailChange, setShowEmailChange] = useState(false);
	const [showPasswordChange, setShowPasswordChange] = useState(false);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				closeFn();
			}
		}
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [closeFn]);

	const sessionsQuery = useQuery(
		["getSessions"],
		() =>
			userContext && userContext.user?.token
				? getUserSessions(userContext.user?.token)
				: Promise.reject("User authentication error. Logout and login again to retry"),
		{
			enabled: !!userContext.user,
		}
	);

	const [changeNameError, setChangeNameError] = useState<string | null>(null);
	const changeNameForm = useForm();
	const changeNameMutation = useMutation({
		mutationFn: (payload: ChangeUserNameType) => {
			return userContext && userContext.user?.token
				? changeName(userContext.user?.token, payload)
				: Promise.reject("User authentication error. Logout and login again to retry.");
		},
		onSuccess: (res) => {
			const response = res.data as UserType;
			if (userContext.user) {
				userContext.setUser({
					user: response,
					token: userContext.user.token,
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
			return userContext && userContext.user?.token
				? changeEmail(userContext.user?.token, payload)
				: Promise.reject("User authentication error. Logout and login again to retry.");
		},
		onSuccess: (res) => {
			const response = res.data as UserType;
			if (userContext.user) {
				userContext.setUser({
					user: response,
					token: userContext.user.token,
					session: userContext.user.session,
				});
				setShowEmailChange(false);
				setChangeEmailError(null);
			}
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setChangeEmailError);
		},
	});

	const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
	const changePasswordForm = useForm();
	const changePasswordMutation = useMutation({
		mutationFn: (payload: ChangePasswordType) => {
			return userContext && userContext.user?.token
				? changePassword(userContext.user?.token, payload)
				: Promise.reject("User authentication error. Logout and login again to retry.");
		},
		onSuccess: () => {
			setShowPasswordChange(false);
			setChangePasswordError(null);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setChangePasswordError);
		},
	});

	return (
		<div className="fixed inset-0 flex place-items-center justify-center z-[60]">
			<div className="bg-black/30 absolute inset-0 z-10"></div>
			<div className="bg-white overflow-hidden rounded-lg shadow relative z-20 w-[90vw] md:w-[70vw] max-w-[60rem]">
				<div className="absolute top-4 right-4 bg-white z-20">
					<Button
						elementChildren="Close"
						elementState="default"
						elementStyle="white_no_border"
						elementSize="xsmall"
						elementType="button"
						elementIcon="ic-close"
						elementIconOnly={true}
						elementIconSize="md"
						onClick={closeFn}
					/>
				</div>
				<div className="md:grid md:grid-cols-4 md:gap-4">
					{/** left sidebar */}
					<div className="hidden md:block col-span-1 border-r px-4">
						<ul className="my-8">
							<li>
								<a
									href="#account-settings"
									className="group px-3 text-gray-500 text-bb font-medium py-0.5 hover:bg-gray-100 hover:text-black my-1 flex rounded-md place-items-center gap-2"
								>
									<span className="ic ic-account-settings opacity-60 group-hover:opacity-100"></span>
									<span>Account</span>
								</a>
							</li>
							<li>
								<a
									href="#security-settings"
									className="group px-3 text-gray-500 text-bb font-medium py-0.5 hover:bg-gray-100 hover:text-black my-1 flex rounded-md place-items-center gap-2"
								>
									<span className="ic ic-security-settings opacity-60 group-hover:opacity-100"></span>
									<span>Security</span>
								</a>
							</li>
						</ul>
					</div>
					{/** main content */}
					<div className="col-span-3 h-[80vh] max-h-[45rem] overflow-auto px-4 relative">
						<h2 id="account-settings" className="pt-7 pb-2">
							Account
						</h2>
						<p className="text-gray-500 font-normal">Manage your profile</p>

						{/** Name */}
						<div className="my-8 pr-4">
							<h3 className="text-bb font-medium py-px text-gray-800 border-b">Full Name</h3>

							{changeNameError && (
								<p className="mx-4 mt-4 text-red-700 text-sm">{changeNameError}</p>
							)}

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
									<p className="mt-3 mx-4 text-gray-900 tracking-wide">
										{userContext?.user?.user.name}
									</p>
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

							{changeEmailError && (
								<p className="mx-4 mt-4 text-red-700 text-sm">{changeEmailError}</p>
							)}

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
												onClick={() => setShowEmailChange(true)}
											/>
										</div>
									</fieldset>
								</form>
							) : (
								<>
									<p className="mt-3 mx-4 text-gray-900 tracking-wide">
										{userContext?.user?.user.email}
									</p>
									{changeEmailMutation.isSuccess && (
										<p className="mx-4 mt-2 text-green-700 text-sm">
											Email changed successfully. You will need to use your new email addresss to
											login.
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

						<h2 id="security-settings" className="pt-7 pb-2">
							Security
						</h2>
						<p className="text-gray-500 font-normal">Manage your security preferences</p>
						{/** Password */}
						<div className="my-8 pr-4">
							<h3 className="text-bb font-medium py-px text-gray-800 border-b">Password</h3>

							{changePasswordError && (
								<p className="mx-4 mt-4 text-red-700 text-sm">{changePasswordError}</p>
							)}

							{showPasswordChange ? (
								<form
									className="mx-4"
									onSubmit={changePasswordForm.handleSubmit((d) => {
										changePasswordMutation.mutate(
											JSON.parse(JSON.stringify(d).replaceAll("as-", ""))
										);
									})}
								>
									<fieldset>
										<InputField
											elementId="as-old_password"
											elementInputType="password"
											elementLabel="Enter current password"
											elementInputMinLength={8}
											elementInputMaxLength={72}
											elementIsRequired={true}
											elementHookFormErrors={changePasswordForm.formState.errors}
											elementHookFormRegister={changePasswordForm.register}
										/>
										<InputField
											elementId="as-new_password"
											elementInputType="password"
											elementLabel="Enter new password"
											elementInputMinLength={8}
											elementInputMaxLength={72}
											elementIsRequired={true}
											elementHookFormErrors={changePasswordForm.formState.errors}
											elementHookFormRegister={changePasswordForm.register}
										/>
										<InputField
											elementId="as-confirm_password"
											elementInputType="password"
											elementLabel="Confirm new password"
											elementInputMinLength={8}
											elementInputMaxLength={72}
											elementIsRequired={true}
											elementHookFormWatch={changePasswordForm.watch}
											elementHookFormWatchField="as-new_password"
											elementHookFormErrors={changePasswordForm.formState.errors}
											elementHookFormRegister={changePasswordForm.register}
										/>
										<div className="flex gap-2">
											<Button
												elementChildren="Save"
												elementState={
													changePasswordMutation.isLoading
														? "loading"
														: changePasswordMutation.isSuccess
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
												onClick={() => setShowPasswordChange(false)}
											/>
										</div>
									</fieldset>
								</form>
							) : (
								<>
									<p className="mt-3 mx-4 text-gray-900 tracking-wide">••••••••••</p>
									{changePasswordMutation.isSuccess && (
										<p className="mx-4 mt-2 text-green-700 text-sm">
											Password changed successfully.
										</p>
									)}
									<div className="mx-4 mt-1">
										<Button
											elementChildren="Change password"
											elementState="default"
											elementStyle="primary_text_opaque"
											elementInvert={true}
											elementSize="xsmall"
											elementType="button"
											elementIcon="ic-edit"
											onClick={() => {
												setShowPasswordChange(true);
												changePasswordMutation.reset();
											}}
										/>
									</div>
								</>
							)}
						</div>
						{/** Active Devices */}
						<div className="my-8 pr-4">
							<h3 className="text-bb font-medium py-px text-gray-800 border-b">Active Devices</h3>
							{sessionsQuery.isSuccess ? (
								<>
									<p className="mt-3 mx-4 text-sm text-gray-600 tracking-wide">
										You have {sessionsQuery.data.length} active sessions
									</p>
									<p className="mt-5 mx-4 text-xs text-gray-500 tracking-wide border-b pb-2">
										Showing Oldest → Newest
									</p>
									{sessionsQuery.data.map((session) => (
										<UserSession session={session} />
									))}
								</>
							) : sessionsQuery.isLoading ? (
								<>
									<Spinner color="gray" size="sm" />
								</>
							) : (
								<></>
							)}
						</div>

						{/** Danger */}
						{/* <div className="my-8 pr-4">
							<h3 className="text-bb font-medium py-px text-gray-800 border-b">Danger</h3>
							<div className="flex gap- my-4">
								<div className="flex-1 px-4">
									<h4 className="text-bb font-medium">Delete Account</h4>
									<p className="text-sm text-gray-500">
										Delete your account and all its associated data
									</p>
								</div>
								<div className="flex justify-center place-content-center">
									<Button
										elementChildren="DELETE ACCOUNT"
										elementState="default"
										elementStyle="danger"
										elementSize="small"
										elementType="button"
										onClick={() => {
											console.log("Ask user to enter password to confirm");
										}}
									/>
								</div>
							</div>
						</div> */}
					</div>
				</div>
			</div>
		</div>
	);
}

function UserSession({session}: {session: UserSessionType}) {
	const userContext = useContext(UserContext);
	const queryClient = useQueryClient();
	const ua_parser = new UAParser(session.ua);

	const closeSessionMutation = useMutation({
		mutationFn: (payload: RemoveSessionType) => {
			return userContext && userContext.user?.token
				? closeSession(userContext.user?.token, payload)
				: Promise.reject("User authentication error. Logout and login again to retry.");
		},
		onSuccess: () => {
			queryClient.invalidateQueries("getSessions");
		},
	});

	return (
		<div key={session.id} className="mx-4 py-4 border-b last:border-none">
			<div className="flex flex-col md:flex-row gap-2 md:place-items-center hover:bg-gray-50 md:px-4 py-3 rounded-md">
				<div className="flex-1 flex flex-col gap-0.5">
					<div className="flex place-items-center gap-2 mb-2">
						<span className="text-gray-950 font-medium text-bb">
							{ua_parser.getOS().name + " " + ua_parser.getOS().version}
						</span>
						{userContext.user?.session === session.id && (
							<span className="inline-block bg-green-100 px-2 py-0.5 rounded text-green-800 font-medium text-sm">
								Current Device
							</span>
						)}
					</div>
					<p className="text-bb text-gray-600">
						{ua_parser.getBrowser().name + " " + ua_parser.getBrowser().version}
					</p>
					<p className="text-bb text-gray-600">
						{session.ip} &nbsp;
						<span className="text-sm">
							(
							<a href={"https://db-ip.com/" + session.ip} target="_blank" rel="noopener noreferrer">
								See Location
							</a>
							)
						</span>
					</p>
					<p className="text-bb text-gray-600">Signed in {timeSince(session.created)}</p>
				</div>
				{userContext.user?.session !== session.id && (
					<div>
						<form>
							<fieldset disabled={closeSessionMutation.isLoading}>
								<Button
									elementChildren="Close Session"
									elementState="default"
									elementStyle="black"
									elementSize="xsmall"
									elementType="button"
									elementIcon="ic-logout"
									onClick={() => {
										closeSessionMutation.mutate({session_id: session.id});
									}}
								/>
							</fieldset>
						</form>
					</div>
				)}
			</div>
		</div>
	);
}
