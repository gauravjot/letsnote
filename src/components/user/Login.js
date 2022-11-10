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
        <div className="text-red-600 py-3 font-medium">
          All fields are required.
        </div>
      );
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
        setAPIResponse(
          <div className="text-success px-2">
            Welcome, {response.data.profile.first_name}
          </div>
        );
      })
      .catch(function (error) {
        if (formRef.current) {
          formRef.current.removeAttribute("disabled");
          formRef.current.className = "";
        }
        setAPIResponse(
          error.response.status > 499 ? (
            <div className="text-red-600 py-3 font-medium">
              Server error {error.response.status}: {error.response.statusText}.
            </div>
          ) : (
            <div className="text-red-600 py-3 font-medium">
              {error.response.data.message[0]}
            </div>
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
            <h3>Sign-in</h3>
            <p className="text-gray-600 text-sm">
              Save your documents and edit later. All without a charge!
            </p>
          </div>
          <div ref={formRef}>
            <div>
              <label
                className="text-sm font-medium text-gray-600 my-1"
                for="email"
              >
                Email
              </label>
              <input
                className="block w-full border border-gray-300 border-solid py-2.5 font-medium px-4 text-sm rounded-lg mt-1 focus-visible:outline-gray-500 focus-visible:bg-gray-100"
                placeholder="you@company.com"
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
                className="text-sm font-medium text-gray-600 my-1"
                for="password"
              >
                Password
              </label>
              <input
                className="block w-full border border-gray-300 border-solid py-2.5 font-medium px-4 text-sm rounded-lg mt-1 focus-visible:outline-gray-500 focus-visible:bg-gray-100"
                placeholder="••••••••"
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
      ) : (
        <>
          <div className="font-mono text-xl font-bold user-select-none text-gray-900 pl-2 mt-6 mb-2">
            <div className="flex">
              <div className="flex-grow">
                <span className="align-middle">Welcome</span>
              </div>
              <div className="flex-grow-0 h-max">
                <button
                  onClick={logOut}
                  className="ab-btn ab-btn-secondary ab-btn-sm bg-black bg-opacity-30 font-normal text-sm whitespace-nowrap"
                >
                  <span className="ic ic-logout"></span>
                </button>
              </div>
            </div>
          </div>
          <div className="bg-slate-300 bg-opacity-50 rounded-md px-3.5 py-2">
            <span className="text-gray-600 font-medium">
              {user.user.full_name}
            </span>
          </div>
        </>
      )}
    </>
  );
}
