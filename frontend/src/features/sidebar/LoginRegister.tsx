import React, {useContext, useState} from "react";
import {userLogout, userLogin, UserLoginInfo} from "@/services/user/log_in_out";
import {UserContext} from "@/App";
import {useForm} from "react-hook-form";
import {AxiosError} from "axios";
import {handleAxiosError} from "@/utils/HandleAxiosError";
import InputField from "@/components/ui/input/Input";
import Button from "@/components/ui/button/Button";
import {UserRegisterInfo, UserRegisterResponse, userRegister} from "@/services/user/register";
import {useMutation} from "react-query";
import {Settings} from "@/features/settings/Settings";
import {UserType} from "@/types/user";
import {ForgotPassword} from "./ForgotPassword";

export default function LoginRegister() {
	const userContext = useContext(UserContext);
	const [showRegister, setShowRegister] = React.useState(false);
	const [showForgotPassword, setShowForgotPassword] = React.useState(false);

	return (
		<>
			{userContext.user ? (
				<UserCard user={userContext.user} />
			) : showRegister ? (
				<RegisterComponent showRegister={setShowRegister} />
			) : showForgotPassword ? (
				<ForgotPassword switchToForgotPassword={setShowForgotPassword} />
			) : (
				<Login switchToRegister={setShowRegister} switchToForgotPassword={setShowForgotPassword} />
			)}
		</>
	);
}

function Login({
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

function RegisterComponent({
	showRegister,
}: {
	showRegister?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const userContext = React.useContext(UserContext);

	const [error, setError] = useState<string | null>(null);
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

function UserCard({user}: {user: UserType}) {
	const userContext = useContext(UserContext);
	const [showSettings, setShowSettings] = React.useState(false);

	const logOut = async () => {
		if (await userLogout()) {
			userContext.setUser(null);
		} else {
			console.log("Could not terminate session.");
		}
	};

	return (
		<>
			{/** User settings */}
			{showSettings && <Settings closeFn={() => setShowSettings(false)} />}

			{/** Main content */}
			<div className="my-3 pb-4 pt-3 px-4 border-b border-gray-300 shadow-smb">
				<div className="text-xl font-bold user-select-none text-gray-900 mb-2.5">Welcome</div>
				<div className="relative">
					<div className="flex place-items-center">
						<span className="ic ic-person ic-black align-middle mr-2"></span>
						<div className="infotrig align-middle text-gray-800 text-[0.92rem] leading-5 font-medium">
							<div className="truncate">{user.user.name}</div>
							<div className="infomsg mt-3 top-2 left-0 whitespace-nowrap">{user.user.email}</div>
						</div>
					</div>
					<div className="ml-6 text-[0.75rem] whitespace-nowrap overflow-hidden text-gray-500">
						{user.user.id}
					</div>
					<div className="flex gap-2 pl-24 py-1.5 justify-center place-items-center bg-gradient-to-r from-transparent via-white to-white absolute top-0 right-0">
						<button
							onClick={() => setShowSettings(!showSettings)}
							className="infotrig aspect-square h-8 w-8 group border hover:border-transparent hover:bg-gray-900 rounded-md shadow bg-white whitespace-nowrap"
						>
							<span className="ic -mt-0.5 group-hover:invert group-hover:opacity-100 ic-black opacity-70 ic-settings align-middle"></span>
							<div className="infomsg mt-3 bottom-9 right-0 whitespace-nowrap">Settings</div>
						</button>
						<button
							onClick={logOut}
							className="infotrig aspect-square h-8 w-8 group hover:bg-gray-900 rounded-md shadow bg-gray-600 whitespace-nowrap"
						>
							<span className="ic -mt-0.5 ic-white ic-logout align-middle"></span>
							<div className="infomsg mt-3 bottom-9 right-0 whitespace-nowrap">Logout</div>
						</button>
					</div>
					{!userContext.user?.user.verified && (
						<div className="bg-gray-50 py-2 px-3 mt-4 text-gray-800 rounded border-gray-300 border">
							<div className="flex place-items-center gap-1 font-medium text-bb">
								<span className="ic-close ic-gray-75 ic"></span>
								<span>Account not verified</span>
							</div>
							<p className="mt-1 text-bb leading-5">
								Please check your email and click on the verification link.
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
