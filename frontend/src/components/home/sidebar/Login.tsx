import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser, logoutUser } from "redux/actions";
import { userLogout, userLogin } from "lib/user/log_in_out";
import { RootState } from "App";

export default function Login() {
	let formRef = React.useRef<HTMLDivElement>(null);
	const user = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [apiResponse, setAPIResponse] = React.useState<string | null>(null);

	const login = async () => {
		// Disable login button and any error messages
		formRef.current?.setAttribute("disabled", "disabled");
		setAPIResponse(null);

		// Check if email and password
		if (!email || !password) {
			setAPIResponse("All fields are required.");
			formRef.current?.removeAttribute("disabled");

			return;
		}

		// Make login request
		const req = await userLogin(email, password);
		if (req.success) {
			dispatch(setUser(req.res));
			setAPIResponse(null);
		} else {
			formRef.current?.removeAttribute("disabled");
			setAPIResponse(req.res);
		}
	};

	const logOut = async () => {
		if (await userLogout(user.token)) {
			dispatch(logoutUser());
		} else {
			console.log("Could not terminate session.");
		}
	};

	return (
		<div className="my-3 mt-6 pb-4 px-4 border-b border-gray-300 shadow-smb">
			{!(user && user.token.length > 0) ? (
				<>
					<div>
						<h2>Sign-in</h2>
						<p className="text-gray-600 text-sm mb-2 mt-1">
							Write your documents and edit later.
						</p>
					</div>
					<div ref={formRef}>
						{apiResponse && (
							<div className="text-sm text-red-700/80 bg-red-50 rounded px-3 mb-2 mt-4 font-medium py-2">
								{apiResponse}
							</div>
						)}
						<div>
							<label
								className="text-sm font-medium text-gray-600 my-1 px-1"
								htmlFor="email"
							>
								Email
							</label>
							<input
								className="block bg-gray-50 w-full border border-gray-200 border-solid py-2 font-medium px-3 text-sm rounded-lg mt-1 focus-visible:outline-gray-400 focus-visible:bg-gray-100"
								type="email"
								id="email"
								onChange={(e) => {
									setEmail(e.target.value);
								}}
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										login();
									}
								}}
							/>
						</div>
						<div className="mt-1.5">
							<label
								className="text-sm font-medium text-gray-600 my-1 px-1"
								htmlFor="password"
							>
								Password
							</label>
							<input
								className="block bg-gray-50 w-full border border-gray-200 border-solid py-2 font-medium px-3 text-sm rounded-lg mt-1 focus-visible:outline-gray-400 focus-visible:bg-gray-100"
								type="password"
								id="password"
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										login();
									}
								}}
							/>
						</div>
						<div className="text-right">
							<input
								className="ab-btn ab-btn-sm ab-btn-long mt-4 cursor-pointer"
								type="submit"
								onClick={login}
								value="Login"
							/>
						</div>
					</div>
				</>
			) : (
				<>
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
									<span className="ic ic-logout align-middle"></span>
									<div className="infomsg mt-3 bottom-9 right-0 whitespace-nowrap">
										Logout
									</div>
								</button>
							</div>
						</div>
					</div>
					<div className="whitespace-nowrap max-w-14 overflow-hidden text-ellipsis">
						<span className="ic ic-person ic-black align-middle mr-2"></span>
						<span className="align-middle text-gray-800 text-[0.92rem] leading-5 font-medium">
							{user.user.full_name}
						</span>
					</div>
					<div className="ml-6 text-[0.75rem] whitespace-nowrap overflow-hidden text-gray-500">
						{user.user.id}
					</div>
				</>
			)}
		</div>
	);
}
