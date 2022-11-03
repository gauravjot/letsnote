import React from "react";
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../config";
import { useSelector } from "react-redux";
import { dateTimePretty, monthYear } from "../utils/TimeSince";

export default function NoteList() {
  const user = useSelector((state) => state.user);
  const [notes, setNotes] = React.useState([]);
  const [error, setError] = React.useState();

  React.useEffect(() => {
    if (user.token) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
      };
      axios
        .get(BACKEND_SERVER_DOMAIN + "/api/note/all", config)
        .then(function (response) {
          setNotes(response.data.reverse());
        })
        .catch(function (error) {
          setError(error.response);
        });
    }
  }, [user.token]);

  const editNote = (note) => {
    console.log("edit");
  };

  const openNote = (note) => {
    console.log("open");
  };

  let count;

  return (
    <>
      <div className="text-xl font-bold text-gray-900 px-2 mt-6 mb-2 font-mono user-select-none">
        Your notes
      </div>
      <ul className="bg-white mb-4 border border-gray-300 rounded-md py-2 shadow-md grid gap-1 max-h-96 overflow-y-scroll">
        {notes.map((note, index) => {
          return (
            <>
              {monthYear(note.updated) !== count ? (
                <div className="text-xs text-gray-500 font-medium bg-gray-200 border-b border-gray-300 px-3 py-1 pb-0 mb-0.5 user-select-none">
                  {(count = monthYear(note.updated))}
                </div>
              ) : (
                ""
              )}
              <li
                key={index}
                className="mx-2 relative px-2 py-1 rounded-md hover:bg-slate-200 cursor-default text-gray-500"
              >
                <div
                  onClick={() => {
                    openNote(note);
                  }}
                >
                  <div className="text-gray-900 font-medium">{note.title}</div>
                  <div className="text-xs">{dateTimePretty(note.updated)}</div>
                </div>
                <button
                  className="line-height-0 p-0.5 absolute m-1 top-0 right-0 cursor-pointer hover:bg-white rounded-md"
                  onClick={() => {
                    editNote(note);
                  }}
                >
                  <span
                    className={"ic ic-md ic-opacity-50 align-middle ic-edit"}
                  ></span>
                </button>
              </li>
            </>
          );
        })}
      </ul>
    </>
  );
}
