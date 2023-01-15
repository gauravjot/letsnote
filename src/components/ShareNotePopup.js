import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../config";

export default function ShareNotePopup({ closePopup, note }) {
  const user = useSelector((state) => state.user);
  const [link, setLink] = React.useState();
  const [title, setTitle] = React.useState("");
  const [anon, setAnon] = React.useState(true);
  const [isCallingAPI, setIsCallingAPI] = React.useState(false);

  const createLink = () => {
    setIsCallingAPI(true);
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
    };
    axios
      .post(
        BACKEND_SERVER_DOMAIN + "/api/note/share/" + note.id + "/",
        JSON.stringify({ title: title, anonymous: anon, expire: 0 }),
        config
      )
      .then(function (response) {
        setLink({
          title: response.data.title,
          urlkey: response.data.urlkey,
          expire: response.data.expire,
          anon: response.data.anonymous,
        });
        setIsCallingAPI(false);
      })
      .catch(function (error) {
        window.onbeforeunload = null;
        setIsCallingAPI(false);
      });
  };

  const handleTitle = ({ target }) => {
    setTitle(target.value);
  };

  const handleCheckBox = ({ target }) => {
    setAnon(target.checked);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40">
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 max-w-lg mr-auto bg-white rounded-md shadow-md p-4">
        <div className="flex">
          <span className="flex-grow text-xl font-bold text-gray-900 font-sans align-middle whitespace-nowrap overflow-hidden">
            Share Note
          </span>

          <button
            className="ab-btn-secondary px-2 text-sm font-medium rounded shadow"
            onClick={() => {
              closePopup();
            }}
          >
            Close
          </button>
        </div>
        <div>
          <div>
            {link ? (
              <>
                <div className="text-lg font-sans mt-4 mb-2">
                  Link is ready{" "}
                  <button
                    className="text-sky-600 text-xs ml-2 border border-gray-200 px-2 rounded hover:bg-gray-200"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        BACKEND_SERVER_DOMAIN + "/note/shared/" + link.urlkey
                      );
                    }}
                  >
                    Copy
                  </button>
                </div>
                <div className="mt-2 mb-2 text-sm text-yellow-700">
                  This is the only time you will see this link. Save it
                  somewhere safe. You can make more in future.
                </div>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded py-1 px-2 bg-sky-100 text-sm"
                  value={BACKEND_SERVER_DOMAIN + "/note/shared/" + link.urlkey}
                  readOnly
                />
                <div className="text-sm my-1 mt-2">
                  Anonymous: {link.anon ? "Yes" : "No"}
                </div>
              </>
            ) : (
              <div>
                <label className="user-select-none text-gray-700 pr-2 pl-0.5 text-sm">
                  Note name
                </label>
                <input
                  type="text"
                  id="title"
                  value={note.title}
                  className="mb-2 rounded bg-gray-100 font-medium w-full px-3 py-1.5 text-sm text-gray-500 focus-visible:outline-gray-400"
                  disabled
                  readOnly
                />
                <label
                  className="user-select-none text-gray-700 pr-2 pl-0.5 text-sm"
                  htmlFor="title"
                >
                  Group name
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={handleTitle}
                  placeholder="friends, work, ..."
                  className="mb-1 rounded bg-gray-200 font-medium w-full px-3 py-1.5 text-sm text-gray-700 focus-visible:outline-gray-400"
                  disabled={isCallingAPI ? "disabled" : ""}
                />
                <label
                  className="user-select-none text-sm text-gray-700 pl-0.5 pr-2"
                  htmlFor="anon"
                >
                  Share as anonymous
                </label>
                <input
                  id="anon"
                  type="checkbox"
                  onChange={handleCheckBox}
                  checked={anon}
                />
                <button
                  className="block mt-2 ab-btn ab-btn-sm"
                  onClick={() => createLink()}
                >
                  Get Share Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
