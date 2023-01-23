import {
  Route,
  Navigate,
  Routes,
  BrowserRouter as Router,
} from "react-router-dom";

import { CookiesProvider } from "react-cookie";
import { useCookies } from "react-cookie";

import { compose } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/reducers";
import { Provider } from "react-redux";

import Home from "./components/Home";
import Shared from "./components/noteshare/Shared";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function App() {
  const [cookies, setCookie] = useCookies(["user"]);

  function saveToCookies(state) {
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

  // old redux
  // const store = createStore(allReducers, persistedState, composeEnhancers());

  const store = configureStore({
    reducer: {
      user: userReducer,
    },
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
              <Route path="/note/shared/:shareid" element={<Shared />} />
              <Route path="/note/:noteid" element={<Home />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </Provider>
    </CookiesProvider>
  );
}
