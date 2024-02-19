import {useContext, useState} from "react";
import Button from "../ui/button/Button";
import InputField from "../ui/input/Input";
import {UserContext} from "@/App";

export function UserSettings({closeFn}: {closeFn: () => void}) {
	const user = useContext(UserContext).user;
	const [showNameChange, setShowNameChange] = useState(false);
	const [showEmailChange, setShowEmailChange] = useState(false);
	const [showPasswordChange, setShowPasswordChange] = useState(false);

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
											defaultValue={user?.user.name}
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
									<p className="mt-3 mx-4 text-gray-900 tracking-wide">{user?.user.name}</p>
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
											defaultValue={user?.user.email}
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
									<p className="mt-3 mx-4 text-gray-900 tracking-wide">{user?.user.email}</p>
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
							<p className="mt-3 mx-4 text-sm text-gray-600 tracking-wide">
								You are currently logged in on 3 devices
							</p>
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
