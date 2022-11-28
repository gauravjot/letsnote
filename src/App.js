import {
  Route,
  Navigate,
  Routes,
  BrowserRouter as Router,
} from "react-router-dom";

import { CookiesProvider } from "react-cookie";
import { useCookies } from "react-cookie";

import { createStore, compose } from "redux";
import allReducers from "./redux/reducers";
import { Provider } from "react-redux";

import Home from "./components/Home";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function App() {
  const [cookies, setCookie] = useCookies(["user"]);

  function saveToCookies(state) {
    try {
      const serializedState = JSON.stringify(state);
      setCookie("user", encodeURIComponent(serializedState), {
        path: "/",
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

  const store = createStore(allReducers, persistedState, composeEnhancers());

  store.subscribe(() => saveToCookies(store.getState()));

  return (
    <CookiesProvider>
      <Provider store={store}>
        <Router>
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/note/:noteid" element={<Home />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </Provider>
    </CookiesProvider>
  );
}
