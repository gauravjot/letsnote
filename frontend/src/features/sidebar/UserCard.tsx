import {UserContext} from "@/App";
import {Settings} from "@/features/settings/Settings";
import {userLogout} from "@/services/user/log_in_out";
import {UserType} from "@/types/user";
import React, {useContext} from "react";

export default function UserCard({user}: {user: UserType}) {
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
			<div className="my-3 pb-4 pt-3 px-4 border-b border-gray-300 shadow-smb sticky top-12 z-20 bg-white">
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
