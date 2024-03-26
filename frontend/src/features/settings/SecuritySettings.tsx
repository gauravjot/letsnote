import {UserContext} from "@/App";
import Button from "@/components/ui/button/Button";
import CheckBox from "@/components/ui/checkbox/CheckBox";
import InputField from "@/components/ui/input/Input";
import Spinner from "@/components/ui/spinner/Spinner";
import {ChangePasswordType, changePassword} from "@/services/user/change_password";
import {DeleteAccountType, deleteAccount} from "@/services/user/delete_account";
import {getUserSessions} from "@/services/user/get_session_list";
import {RemoveSessionType, closeSession} from "@/services/user/remove_session";
import {UserSessionType} from "@/types/user";
import {timeSince} from "@/utils/DateTimeUtils";
import {handleAxiosError} from "@/utils/HandleAxiosError";
import {AxiosError} from "axios";
import {useState, useContext} from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {UAParser} from "ua-parser-js";

export default function SecuritySettings() {
	const userContext = useContext(UserContext);
	const [showPasswordChange, setShowPasswordChange] = useState(false);
	const [showDeleteAccount, setShowDeleteAccount] = useState(false);

	// Get user sessions list
	const sessionsQuery = useQuery(
		["getSessions"],
		() =>
			userContext && userContext.user
				? getUserSessions()
				: Promise.reject("User authentication error. Logout and login again to retry"),
		{
			enabled: !!userContext.user,
		}
	);

	// Change Password Form and Mutation
	const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
	const changePasswordForm = useForm();
	const changePasswordMutation = useMutation({
		mutationFn: (payload: ChangePasswordType) => {
			return userContext && userContext.user
				? changePassword(payload)
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
		<>
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
							changePasswordMutation.mutate(JSON.parse(JSON.stringify(d).replaceAll("as-", "")));
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
							<p className="mx-4 mt-2 text-green-700 text-sm">Password changed successfully.</p>
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
							<UserSession session={session} key={session.id} />
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

			{/* * Danger */}
			<div className="my-8 pr-4">
				<h3 className="text-bb font-medium py-px text-gray-800 border-b">Danger</h3>
				<div className="flex gap- my-4">
					<div className="flex-1 px-4">
						<h4 className="text-bb font-medium">Delete Account</h4>
						<p className="text-sm text-gray-500">Delete your account and all its associated data</p>
					</div>
					<div className="flex justify-center place-content-center">
						<div>
							<Button
								elementChildren="DELETE ACCOUNT"
								elementState="default"
								elementStyle="danger"
								elementSize="small"
								elementType="button"
								onClick={() => {
									setShowDeleteAccount(true);
								}}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* * Delete Account Dialog */}
			{showDeleteAccount && userContext.user && (
				<DeleteAccountDialog closeFn={() => setShowDeleteAccount(false)} />
			)}
		</>
	);
}

function UserSession({session}: {session: UserSessionType}) {
	const userContext = useContext(UserContext);
	const queryClient = useQueryClient();
	const ua_parser = new UAParser(session.ua);

	const closeSessionMutation = useMutation({
		mutationFn: (payload: RemoveSessionType) => {
			return userContext && userContext.user
				? closeSession(payload)
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

function DeleteAccountDialog({closeFn}: {closeFn: () => void}) {
	const mForm = useForm();
	const userContext = useContext(UserContext);

	// Change Password Form and Mutation
	const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);
	const deleteAccountMutation = useMutation({
		mutationFn: (payload: DeleteAccountType) =>
			userContext.user
				? deleteAccount(payload)
				: Promise.reject("User authentication error. Logout and login again to retry"),
		onSuccess: () => {
			// Let user know account is deleted
			setTimeout(() => {
				// Log out user
				userContext.setUser(null);
				// send to home
				window.location.href = "/";
			}, 5000);
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setDeleteAccountError);
		},
	});

	function closeDialog() {
		deleteAccountMutation.reset();
		mForm.reset();
		closeFn();
	}

	return (
		<div className="fixed inset-0 flex place-items-center justify-center z-50">
			<div className="backdrop-blur-sm bg-black/10 absolute inset-0" onClick={closeDialog}></div>
			{deleteAccountMutation.isLoading ? (
				<Spinner color="black" size="md" />
			) : deleteAccountMutation.isSuccess ? (
				<div className="max-w-[400px] outline outline-4 outline-green-600/20 py-4 px-5 w-4/5 bg-white rounded-2xl shadow-md relative z-10">
					<h3 className="text-black select-none mb-3">Account Deleted</h3>
					<p className="text-gray-700 my-3">
						Your account is deleted successfully. You will be logged out in 5 seconds.
					</p>
				</div>
			) : (
				<div className="max-w-[400px] outline outline-4 outline-red-600/40 py-4 px-5 w-4/5 bg-white rounded-2xl shadow-md relative z-10">
					<div className="flex justify-between place-items-center mb-3">
						<h3 className="text-black select-none">Delete Account</h3>
						<Button
							elementChildren="Close"
							elementIcon="close"
							elementType="button"
							elementState="default"
							elementStyle="white_no_border"
							elementSize="xsmall"
							elementIconSize="lg"
							elementIconOnly={true}
							onClick={closeDialog}
						/>
					</div>
					<p className="text-gray-700 mb-4">
						If you continue with deletion, please know that{" "}
						<span className="text-red-700 underline">account will be deleted permanently</span> and
						it cannot be reinstated.
					</p>
					<p className="text-bb">To continue, please enter following:</p>
					{deleteAccountError && (
						<p className="text-sm text-red-600 bg-red-100 px-2 mt-3 py-1 rounded">
							{deleteAccountError}
						</p>
					)}
					<form
						onSubmit={mForm.handleSubmit((d) => {
							if (d["consent"]) {
								deleteAccountMutation.mutate({password: d["delete-account-password"]});
							}
						})}
					>
						<fieldset>
							<InputField
								elementId="delete-account-password"
								elementInputType="password"
								elementLabel="Password"
								elementInputMinLength={8}
								elementInputMaxLength={72}
								elementIsRequired={true}
								elementWidth="full"
								elementHookFormErrors={mForm.formState.errors}
								elementHookFormRegister={mForm.register}
							/>
							<CheckBox
								elementId="consent"
								elementLabel="Continue with deletion"
								elementHookFormErrors={mForm.formState.errors}
								elementHookFormRegister={mForm.register}
								elementIsRequired={true}
							/>
							<Button
								elementChildren="DELETE ACCOUNT"
								elementState="default"
								elementStyle="danger"
								elementInvert={true}
								elementWidth="full"
								elementType="submit"
							/>
							<Button
								elementChildren="Cancel"
								elementState="default"
								elementStyle="primary"
								elementWidth="full"
								elementType="button"
								onClick={closeDialog}
							/>
						</fieldset>
					</form>
				</div>
			)}
		</div>
	);
}
