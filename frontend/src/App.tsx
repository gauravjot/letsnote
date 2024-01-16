import { Route, Navigate, Routes, BrowserRouter as Router } from "react-router-dom";
/* Redux */
import { Provider } from "react-redux";
import { compose } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/reducers";
/* Cookies */
import { CookiesProvider } from "react-cookie";
import { useCookies } from "react-cookie";
/* Components */
import Home from "@/components/home/Home";
import Shared from "@/components/shared/SharePage";

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof _store.getState>;
export type AppDispatch = typeof _store.dispatch;
// this store is only used for typing
const reducer_list = {
	user: userReducer,
};
const _store = configureStore({
	reducer: reducer_list,
});
// Redux browser extension support
const composeEnhancers =
	((window as any)["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] as typeof compose) ||
	compose;

export default function App() {
	// Using cookies to for user session
	const [cookies, setCookie] = useCookies(["user"]);

	// Save cookies
	function saveToCookies(state: RootState) {
		try {
			const serializedState = JSON.stringify(state);
			setCookie("user", encodeURIComponent(serializedState), {
				path: "/",
				expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
			});
		} catch (e) {
			console.log(e);
		}
	}

	// Read cookies
	function loadFromCookies() {
		try {
			const serializedState = cookies.user;
			if (serializedState === null) return undefined;
			return JSON.parse(decodeURIComponent(serializedState));
		} catch (e) {
			console.log(e);
			return undefined;
		}
	}
	const persistedState = loadFromCookies();

	// Make Redux Store and subscribe to changes
	const store = configureStore({
		reducer: reducer_list,
		enhancers: composeEnhancers,
		preloadedState: persistedState,
	});
	store.subscribe(() => saveToCookies(store.getState()));

	return (
		<CookiesProvider>
			<Provider store={store}>
				<Router>
					<div>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route
								path="/note/shared/:nui/:shareid"
								element={<Shared />}
							/>
							<Route path="/note/:noteid" element={<Home />} />
							<Route path="*" element={<Navigate to="/" replace />} />
						</Routes>
					</div>
				</Router>
			</Provider>
		</CookiesProvider>
	);
}
