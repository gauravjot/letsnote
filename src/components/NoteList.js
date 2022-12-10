import React from "react";
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../config";
import { useSelector } from "react-redux";
import MakeNewNote from "./MakeNewNote";
import NoteItem from "./NoteItem";
import { monthYear } from "../utils/TimeSince";

export default function NoteList({ openNote, currentNote, refresh }) {
  const user = useSelector((state) => state.user);
  const [notes, setNotes] = React.useState([]);
  const [error, setError] = React.useState();
  const [showCreateBox, setShowCreateBox] = React.useState(false);

  React.useEffect(() => {
    refreshNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refresh]);

  const refreshNotes = () => {
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
  };

  const newNoteCreated = (note) => {
    setShowCreateBox(false);
    setNotes([note, ...notes]);
    openNote(note);
  };

  let count;

  return user.token ? (
    <>
      <div className="text-xl font-bold text-gray-900 pl-2 mt-6 mb-2 user-select-none">
        <div className="flex">
          <div className="flex-grow">
            <span className="font-sans align-middle whitespace-nowrap overflow-hidden">
              Your Notes
            </span>
          </div>
          <div className="flex-grow-0 h-max">
            <button
              onClick={() => {
                setShowCreateBox(!showCreateBox);
              }}
              className={
                (showCreateBox
                  ? "bg-gray-400 border-solid hover:bg-gray-500 hover:border-gray-500"
                  : "border-dashed hover:bg-gray-300") +
                "  h-7 w-7 cursor-pointer align-middle rounded-md border-2 border-gray-400 p-0"
              }
            >
              <span
                className={
                  (showCreateBox ? "ic-close" : "ic-add ic-black") +
                  " inline-block align-baseline h-4 w-4 p-1 invert"
                }
              ></span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={
          (showCreateBox ? "max-h-36" : "max-h-0") +
          " transition-all duration-500 ease-linear overflow-hidden"
        }
      >
        <MakeNewNote onNewNoteCreated={newNoteCreated} />
      </div>
      {notes.length > 0 ? (
        <div className="notelist bg-gray-50 mb-4 border border-gray-300 rounded-md py-2 shadow-md grid gap-1 min-h-fit max-h-96 overflow-y-scroll overflow-x-hidden">
          {notes.map((note) => {
            return (
              <div key={note.id}>
                {monthYear(note.updated) !== count ? (
                  <div className="text-xs text-gray-500 font-medium bg-gray-300 bg-opacity-50 border-b border-gray-300 px-3 py-1 pb-0 mb-1.5 user-select-none">
                    {(count = monthYear(note.updated))}
                  </div>
                ) : (
                  ""
                )}
                <NoteItem
                  note={note}
                  count={count}
                  openNote={openNote}
                  currentNote={currentNote}
                  refreshNotes={refreshNotes}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-2 py-2 text-xl text-gray-400 font-thin user-select-none">
          It's so empty here. Make a note in editor!
        </div>
      )}
    </>
  ) : (
    <></>
  );
}
