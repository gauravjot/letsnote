import React from "react";
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../../config";
import { useSelector, useDispatch } from "react-redux";
import { setUser, logoutUser } from "../../redux/actions";

export default function Login() {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	let formRef = React.useRef();
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [apiResponse, setAPIResponse] = React.useState(<></>);

	const handleEmail = ({ target }) => {
		setEmail(target.value);
	};
	const handlePassword = ({ target }) => {
		setPassword(target.value);
	};

	const login = () => {
		formRef.current.className = "opacity-30 pointer-events-none";
		formRef.current.setAttribute("disabled", "disabled");

		setAPIResponse(<></>);

		if (!email || !password) {
			setAPIResponse(
				<span className="text-red-600 py-3 font-medium">
					All fields are required.
				</span>
			);
			formRef.current.removeAttribute("disabled");
			formRef.current.className = "";
			return;
		}

		let config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		axios
			.post(
				BACKEND_SERVER_DOMAIN + "/api/user/login/",
				JSON.stringify({ email: email, password: password }),
				config
			)
			.then(function (response) {
				dispatch(setUser(response.data));
				setAPIResponse(<></>);
			})
			.catch(function (error) {
				if (formRef.current) {
					formRef.current.removeAttribute("disabled");
					formRef.current.className = "";
				}
				setAPIResponse(
					error.response.status > 499 ? (
						<span className="text-red-600 py-3 font-medium">
							Server error {error.response.status}:{" "}
							{error.response.statusText}.
						</span>
					) : (
						<span className="text-red-600 py-3 font-medium">
							{error.response.data.message[0]}
						</span>
					)
				);
			});
	};

	const logOut = () => {
		let config = {
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: user.token,
			},
		};
		axios
			.delete(BACKEND_SERVER_DOMAIN + "/api/user/logout/", config)
			.then(() => {
				dispatch(logoutUser());
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<>
			{!(user.token && user.token.length > 0) ? (
				<div>
					<div>
						<h2 className="px-1">Sign-in</h2>
						<p className="text-gray-600 text-sm mb-2 mt-1 px-1">
							Write your documents and edit later.
						</p>
					</div>
					<div ref={formRef}>
						<div className="bg-white rounded-md shadow border p-3 pt-2">
							{apiResponse}
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
									onChange={handleEmail}
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
									onChange={handlePassword}
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
					</div>
				</div>
			) : (
				<div className="my-3 mt-6 pb-4 border-b border-gray-300 shadow-smb">
					<div className="text-xl font-bold user-select-none text-gray-900 pl-2 mb-2">
						<div className="flex mx-4">
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
					<div className="mx-6">
						<span className="ic ic-person ic-black align-middle mr-2"></span>
						<span className="align-middle text-gray-800 text-[0.92rem] leading-5 font-medium whitespace-nowrap max-w-14 overflow-hidden text-ellipsis">
							{user.user.full_name}
						</span>
						<div className="ml-6 text-[0.75rem] overflow-hidden text-gray-500">
							{user.user.id}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
