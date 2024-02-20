import {Route, Navigate, Routes, BrowserRouter as Router} from "react-router-dom";
/* Components */
import Home from "@/components/home/Home";
import Shared from "@/components/share_page/SharePage";
import React, {createContext, useEffect, useState} from "react";
import {UserReduxType} from "./services/user/log_in_out";

export const UserContext = createContext({
	user: null,
	setUser: () => {
		return null;
	},
} as {
	user: UserReduxType | null;
	setUser: React.Dispatch<React.SetStateAction<UserReduxType | null>>;
});

export default function App() {
	const readFromLocalStorage = (): UserReduxType | null => {
		try {
			const serializedState = localStorage.getItem("user");
			if (serializedState === null) {
				return null;
			}
			return JSON.parse(decodeURIComponent(serializedState)).user;
		} catch (e) {
			return null;
		}
	};
	const [user, setUser] = useState<UserReduxType | null>(readFromLocalStorage());

	useEffect(() => {
		// save
		if (user) {
			try {
				const serializedState = JSON.stringify({user: user});
				localStorage.setItem("user", encodeURIComponent(serializedState));
			} catch (e) {
				console.log(e);
			}
		} else {
			localStorage.removeItem("user");
		}
	}, [user]);

	return (
		<UserContext.Provider
			value={{
				user: user,
				setUser: setUser,
			}}
		>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/shared/:shareid" element={<Shared />} />
					<Route path="/note/shared/:nui/:shareid" element={<Shared />} /> {/* Legacy */}
					<Route path="/note/:noteid" element={<Home />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</Router>
		</UserContext.Provider>
	);
}
