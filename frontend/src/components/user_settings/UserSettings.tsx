import {useContext, useState} from "react";
import Button from "../ui/button/Button";
import InputField from "../ui/input/Input";
import {UserContext} from "@/App";
import {useMutation, useQuery} from "react-query";
import {ChangeUserNameType, changeName} from "@/services/user/change_user_name";
import {UserType} from "@/types/user";
import {ChangeEmailType, changeEmail} from "@/services/user/change_email";
import {ChangePasswordType, changePassword} from "@/services/user/change_password";
import {getUserSessions} from "@/services/user/get_session_list";
import Spinner from "../ui/spinner/Spinner";
import {timeSince} from "@/utils/TimeSince";
import {RemoveSessionType, closeSession} from "@/services/user/remove_session";

export function UserSettings({closeFn}: {closeFn: () => void}) {
	const userContext = useContext(UserContext);
	const [showNameChange, setShowNameChange] = useState(false);
	const [showEmailChange, setShowEmailChange] = useState(false);
	const [showPasswordChange, setShowPasswordChange] = useState(false);
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

	const changeNameMutation = useMutation({
		mutationFn: (payload: ChangeUserNameType) => {
			return userContext && userContext.user?.token
				? changeName(userContext.user?.token, payload)
				: Promise.reject("User authentication error. Logout and login again to retry.");
		},
		onSuccess: (res) => {
			const response = res.data as UserType;
			if (userContext.user?.token)
				userContext.setUser({user: response, token: userContext.user?.token});
		},
	});

	const changeEmailMutation = useMutation({
		mutationFn: (payload: ChangeEmailType) => {
			return userContext && userContext.user?.token
				? changeEmail(userContext.user?.token, payload)
				: Promise.reject("User authentication error. Logout and login again to retry.");
		},
		onSuccess: (res) => {
			const response = res.data as UserType;
			if (userContext.user?.token)
				userContext.setUser({user: response, token: userContext.user?.token});
		},
	});

	const changePasswordMutation = useMutation({
		mutationFn: (payload: ChangePasswordType) => {
			return userContext && userContext.user?.token
				? changePassword(userContext.user?.token, payload)
				: Promise.reject("User authentication error. Logout and login again to retry.");
		},
		onSuccess: (res) => {
			const response = res.data as UserType;
			if (userContext.user?.token)
				userContext.setUser({user: response, token: userContext.user?.token});
		},
	});

	const closeSessionMutation = useMutation({
		mutationFn: (payload: RemoveSessionType) => {
			return userContext && userContext.user?.token
				? closeSession(userContext.user?.token, payload)
				: Promise.reject("User authentication error. Logout and login again to retry.");
		},
	});

	return (
		<div className="fixed inset-0 flex place-items-center justify-center z-[60]">
			<div className="bg-black/30 absolute inset-0 z-10"></div>
			<div className="bg-white overflow-hidden rounded-lg shadow relative z-20 w-[70vw] max-w-[60rem]">
				<div className="absolute top-3 right-4 bg-white">
					<Button
						elementChildren="Close"
						elementState="default"
						elementStyle="white_no_border"
						elementSize="xsmall"
						elementType="button"
						elementIcon="ic-close"
						elementIconOnly={true}
						onClick={closeFn}
					/>
				</div>
				<div className="grid grid-cols-4 gap-4">
					{/** left sidebar */}
					<div className="col-span-1 border-r px-4">
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
					<div className="col-span-3 h-[60vh] max-h-[45rem] overflow-auto px-4">
						<h2 id="account-settings" className="pt-7">
							Account
						</h2>
						<p className="my-2 text-gray-500 font-normal">Manage your profile</p>

						{/** Name */}
						<div className="my-8 pr-4">
							<h3 className="text-bb font-medium py-px text-gray-800 border-b">Full Name</h3>

							{showNameChange ? (
								<form className="mx-4">
									<fieldset>
										<InputField
											elementId="as-name"
											elementInputType="text"
											elementLabel="Enter new name"
											defaultValue={userContext?.user?.user.name}
											elementInputMinLength={2}
											elementInputMaxLength={64}
											elementIsRequired={true}
										/>
										<div className="flex gap-2">
											<Button
												elementChildren="Save"
												elementState="default"
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
									<div className="mx-4 mt-1">
										<Button
											elementChildren="Change your name"
											elementState="default"
											elementStyle="primary_text_opaque"
											elementInvert={true}
											elementSize="xsmall"
											elementType="button"
											elementIcon="ic-edit"
											onClick={() => setShowNameChange(true)}
										/>
									</div>
								</>
							)}
						</div>

						{/** Email */}
						<div className="my-8 pr-4">
							<h3 className="text-bb font-medium py-px text-gray-800 border-b">Email address</h3>

							{showEmailChange ? (
								<form className="mx-4">
									<fieldset>
										<InputField
											elementId="as-email"
											elementInputType="email"
											elementLabel="Enter new email address"
											defaultValue={userContext?.user?.user.email}
											elementInputMinLength={5}
											elementInputMaxLength={256}
											elementIsRequired={true}
										/>
										<div className="flex gap-2">
											<Button
												elementChildren="Save"
												elementState="default"
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
									</p>
									<div className="mx-4 mt-1">
										<Button
											elementChildren="Change email address"
											elementState="default"
											elementStyle="primary_text_opaque"
											elementInvert={true}
											elementSize="xsmall"
											elementType="button"
											elementIcon="ic-edit"
											onClick={() => setShowEmailChange(true)}
										/>
									</div>
								</>
							)}
						</div>

						<h2 id="security-settings" className="pt-7">
							Security
						</h2>
						<p className="my-2 text-gray-500 font-normal">Manage your security preferences</p>
						{/** Password */}
						<div className="my-8 pr-4">
							<h3 className="text-bb font-medium py-px text-gray-800 border-b">Password</h3>

							{showPasswordChange ? (
								<form className="mx-4">
									<fieldset>
										<InputField
											elementId="as-password"
											elementInputType="password"
											elementLabel="Enter new password"
											elementInputMinLength={8}
											elementInputMaxLength={72}
											elementIsRequired={true}
										/>
										<InputField
											elementId="as-confirm-password"
											elementInputType="password"
											elementLabel="Confirm new password"
											elementInputMinLength={8}
											elementInputMaxLength={72}
											elementIsRequired={true}
										/>
										<div className="flex gap-2">
											<Button
												elementChildren="Save"
												elementState="default"
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
									<div className="mx-4 mt-1">
										<Button
											elementChildren="Change password"
											elementState="default"
											elementStyle="primary_text_opaque"
											elementInvert={true}
											elementSize="xsmall"
											elementType="button"
											elementIcon="ic-edit"
											onClick={() => setShowPasswordChange(true)}
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
									{sessionsQuery.data.map((session) => {
										return (
											<div key={session.id} className="mx-4 py-4 border-b last:border-none">
												<div className="flex gap-2">
													<div className="flex-1 text-sm text-gray-500">
														<p className="text-xs text-gray-700 font-medium">Device IP Address:</p>
														<p>{session.ip}</p>
														<p className="text-xs text-gray-700 font-medium mt-4">
															First Logged in:
														</p>
														<p>{timeSince(session.created)}</p>
														<p className="text-xs text-gray-700 font-medium mt-4">User Agent:</p>
														<p>{session.ua}</p>
													</div>
													<div>
														<Button
															elementChildren="Close Session"
															elementState="default"
															elementStyle="danger"
															elementSize="xsmall"
															elementType="button"
															elementIcon="ic-close"
															elementIconOnly={true}
															onClick={() => {
																console.log("Close session with id: ", session.id);
															}}
														/>
													</div>
												</div>
											</div>
										);
									})}
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
						<div className="my-8 pr-4">
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
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
