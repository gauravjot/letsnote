import {Route, Navigate, Routes, BrowserRouter as Router} from "react-router-dom";
/* Components */
import React, {Suspense, createContext, useEffect, useState} from "react";
import {UserReduxType} from "./services/user/log_in_out";
import Spinner from "./components/ui/spinner/Spinner";

// lazy imports
const Home = React.lazy(() => import("@/pages/Home"));
const SharedPage = React.lazy(() => import("@/pages/Shared/SharedPage"));

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
					<Route
						path="/shared/:shareid"
						element={
							<Suspense
								fallback={
									<div className="fixed inset-0 size-full flex gap-4 place-items-center justify-center">
										<Spinner size="md" color="gray" />
										<p className="inline-block bg-black/5 border border-gray-300 px-2 py-0.5 rounded-md text-bb">
											Loading page...
										</p>
									</div>
								}
							>
								<SharedPage />
							</Suspense>
						}
					/>
					<Route
						path="/note/shared/:nui/:shareid"
						element={
							<Suspense
								fallback={
									<div className="fixed inset-0 size-full flex gap-4 place-items-center justify-center">
										<Spinner size="md" color="gray" />
										<p className="inline-block bg-black/5 border border-gray-300 px-2 py-0.5 rounded-md text-bb">
											Loading page...
										</p>
									</div>
								}
							>
								<SharedPage />
							</Suspense>
						}
					/>{" "}
					{/* Legacy */}
					<Route
						path="/note/:noteid"
						element={
							<Suspense
								fallback={
									<div className="fixed inset-0 size-full flex gap-4 place-items-center justify-center">
										<Spinner size="md" color="gray" />
										<p className="inline-block bg-black/5 border border-gray-300 px-2 py-0.5 rounded-md text-bb">
											Loading page...
										</p>
									</div>
								}
							>
								<Home />
							</Suspense>
						}
					/>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</Router>
		</UserContext.Provider>
	);
}
