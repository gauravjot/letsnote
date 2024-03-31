import {Route, Navigate, Routes, BrowserRouter as Router} from "react-router-dom";
/* Components */
import React, {Suspense, createContext, useEffect, useState} from "react";
import Spinner from "./components/ui/spinner/Spinner";
import {UserType} from "./types/user";
import axios from "axios";
import {BACKEND_SERVER_DOMAIN} from "./config";

// lazy imports
const Home = React.lazy(() => import("@/pages/Home"));
const SharedPage = React.lazy(() => import("@/pages/Shared/SharedPage"));
const PasswordResetPage = React.lazy(() => import("@/pages/PasswordReset"));

export const UserContext = createContext({
	user: null,
	setUser: () => {
		return null;
	},
} as {
	user: UserType | null;
	setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
});

export default function App() {
	const [user, setUser] = useState<UserType | null>(null);

	useEffect(() => {
		// Check if user is logged in
		async function checkUser() {
			await axios
				.get(BACKEND_SERVER_DOMAIN + "/api/user/profile/", {
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				})
				.then((response) => {
					setUser(response.data.data);
				})
				.catch(() => {
					return setUser(null);
				});
		}
		checkUser();
	}, []);

	return (
		<UserContext.Provider
			value={{
				user: user,
				setUser: setUser,
			}}
		>
			<Router>
				<Suspense>
					<Routes>
						<Route
							path="/"
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
						<Route
							path="/passwordreset/:token"
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
									<PasswordResetPage />
								</Suspense>
							}
						/>
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
									{/* Legacy */}
									<SharedPage />
								</Suspense>
							}
						/>
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
				</Suspense>
			</Router>
		</UserContext.Provider>
	);
}
