import React, {useContext, useState} from "react";
import {
	userLogout,
	userLogin,
	UserLoginResponse,
	UserLoginInfo,
	UserReduxType,
} from "@/services/user/log_in_out";
import {UserContext} from "@/App";
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import {AxiosError} from "axios";
import {handleAxiosError} from "@/utils/HandleAxiosError";
import InputField from "@/components/ui/input/Input";
import Button from "@/components/ui/button/Button";
import {UserRegisterInfo, UserRegisterResponse, userRegister} from "@/services/user/register";
import {useMutation} from "react-query";

export default function LoginRegister({showLinkToHome = false}: {showLinkToHome?: boolean}) {
	const userContext = useContext(UserContext);
	const [showRegister, setShowRegister] = React.useState(false);

	return (
		<>
			{userContext.user && userContext.user.token.length > 0 ? (
				<UserCard user={userContext.user} />
			) : showRegister ? (
				<RegisterComponent showRegister={setShowRegister} />
			) : (
				<Login switchToRegister={setShowRegister} />
			)}

			{showLinkToHome && (
				<div className="m-4">
					<Link to={"/"} className="text-sm hover:underline hover:underline-offset-4">
						&#8592; Go back to Letsnote
					</Link>
				</div>
			)}
		</>
	);
}

function Login({
	switchToRegister,
}: {
	switchToRegister?: React.Dispatch<React.SetStateAction<boolean>>;
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
		onSuccess: (data: UserLoginResponse) => {
			setError(null);
			reset();
			userContext.setUser(data.data);
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
			{switchToRegister && (
				<p className="text-bb text-gray-500">
					Don't have an account?{" "}
					<button
						className="text-primary-700 hover:underline"
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
			userContext.setUser(data.data);
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
				<p className="text-bb text-gray-500">
					Already have an account?{" "}
					<button className="text-primary-700 hover:underline" onClick={() => showRegister(false)}>
						Login here
					</button>
				</p>
			)}
		</div>
	);
}

function UserCard({user}: {user: UserReduxType}) {
	const userContext = useContext(UserContext);

	const logOut = async () => {
		if (await userLogout(user.token)) {
			userContext.setUser(null);
		} else {
			console.log("Could not terminate session.");
		}
	};

	return (
		<div className="my-3 pb-4 pt-3 px-4 border-b border-gray-300 shadow-smb">
			<div className="text-xl font-bold user-select-none text-gray-900 mb-2">
				<div className="flex">
					<div className="flex-grow">
						<span className="align-middle">Welcome</span>
					</div>
					<div className="flex-grow-0 h-max">
						<button
							onClick={logOut}
							className="infotrig ab-btn ab-btn-secondary ab-btn-sm bg-black bg-opacity-30 font-normal text-sm whitespace-nowrap"
						>
							<span className="ic ic-white ic-logout align-middle"></span>
							<div className="infomsg mt-3 bottom-9 right-0 whitespace-nowrap">Logout</div>
						</button>
					</div>
				</div>
			</div>
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
		</div>
	);
}
