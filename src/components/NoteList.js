import React from "react";
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../config";
import { useSelector } from "react-redux";
import { dateTimePretty, monthYear } from "../utils/TimeSince";
import MakeNewNote from "./MakeNewNote";

export default function NoteList({ openNote, currentNote }) {
  const user = useSelector((state) => state.user);
  const [notes, setNotes] = React.useState([]);
  const [error, setError] = React.useState();
  const [showCreateBox, setShowCreateBox] = React.useState(false);

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

  const newNoteCreated = (note) => {
    setShowCreateBox(false);
    setNotes([note, ...notes]);
    openNote(note);
  };

  let count;

  return (
    <>
      <div className="text-xl font-bold text-gray-900 pl-2 mt-6 mb-2 font-mono user-select-none">
        <div className="flex">
          <div className="flex-grow">
            <span className="align-middle">Your Notes</span>
          </div>
          <div className="flex-grow-0 h-max">
            <button
              onClick={() => {
                setShowCreateBox(!showCreateBox);
              }}
              className={
                (showCreateBox
                  ? "bg-slate-400 border-solid hover:bg-slate-500"
                  : "border-dashed hover:bg-slate-300") +
                "  h-8 w-8 cursor-pointer align-middle rounded-md shadow border-2 border-slate-400 p-0"
              }
            >
              <span
                className={
                  (showCreateBox ? "ic-close" : "ic-add ic-black") + " ic"
                }
              ></span>
            </button>
          </div>
        </div>
      </div>
      <MakeNewNote
        showCreateBox={showCreateBox}
        onNewNoteCreated={newNoteCreated}
      />
      {notes.length > 0 ? (
        <ul className="bg-white mb-4 border border-gray-300 rounded-md py-2 shadow-md grid gap-1 max-h-96 overflow-y-scroll">
          {notes.map((note, index) => {
            return (
              <div key={index}>
                {monthYear(note.updated) !== count ? (
                  <div className="text-xs text-gray-500 font-medium bg-gray-200 border-b border-gray-300 px-3 py-1 pb-0 mb-1.5 user-select-none">
                    {(count = monthYear(note.updated))}
                  </div>
                ) : (
                  ""
                )}
                <li
                  className={
                    (note.id === currentNote
                      ? "bg-slate-300 rounded-md"
                      : "hover:bg-slate-200") +
                    " mx-2 mb-0.5 relative px-2 py-1 rounded-md cursor-default text-gray-500"
                  }
                >
                  <div
                    onClick={() => {
                      openNote(note);
                    }}
                  >
                    <div className="text-gray-900 font-medium">
                      {note.title}
                    </div>
                    <div className="text-xs">
                      {dateTimePretty(note.updated)}
                    </div>
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
              </div>
            );
          })}
        </ul>
      ) : (
        ""
      )}
    </>
  );
}
