import React from "react";
import { dateTimePretty } from "../utils/TimeSince";
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../config";
import { useSelector } from "react-redux";
import { redirect } from "react-router-dom";

export default function NoteItem({
  note,
  openNote,
  currentNote,
  shareNote,
  refreshNotes,
}) {
  const optionsRef = React.useRef();
  const user = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const openMenu = () => {
    if (menuOpen) {
      closeOpenMenus();
    } else {
      document.addEventListener("mousedown", closeOpenMenus);
      setMenuOpen(true);
    }
  };

  const closeOpenMenus = (e) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target)) {
      setMenuOpen(false);
      document.removeEventListener("mousedown", closeOpenMenus);
    }
  };

  const deleteNote = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this note?\nThis cannot be reversed.\n\nTitle: " +
          note.title +
          "\nCreated: " +
          dateTimePretty(note.created) +
          "\n"
      )
    ) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
      };
      axios
        .delete(BACKEND_SERVER_DOMAIN + "/api/note/" + note.id + "/", config)
        .then(function (response) {
          // if (response.data.action) {
          //   refreshNotes();
          // }
          window.location.replace("/");
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  };

  const renameNote = () => {};

  return (
    <div>
      <div
        className={
          (note.id === currentNote
            ? "bg-gray-300 rounded-md"
            : "hover:bg-gray-200") +
          " flex mx-2 mb-0.5 relative py-1 rounded-md cursor-default text-gray-500"
        }
      >
        <div
          className="flex-grow px-2"
          onClick={() => {
            openNote(note);
          }}
        >
          <div className="text-gray-900 max-w-12 text-ellipsis font-medium line-height-125 whitespace-nowrap overflow-hidden">
            {note.title}
          </div>
          <div className="text-xs mt-1 whitespace-nowrap overflow-hidden">
            {dateTimePretty(note.updated)}
          </div>
        </div>
        <div className="h-fit self-center relative">
          <button
            className="line-height-0 p-1 ml-2 cursor-pointer hover:rotate-90 focus:rotate-90 focus-within:rotate-90 transition-all rounded-md"
            onClick={() => {
              openMenu();
            }}
          >
            <span
              className={"ic ic-md ic-gray-50 align-middle ic-options-vertical"}
            ></span>
          </button>
          <div
            ref={optionsRef}
            className={
              (menuOpen ? "scale-100 " : "scale-0 ") +
              "transition-all origin-bottom-right absolute right-8 -bottom-2 bg-gray-600 border border-gray-700 border-solid text-white rounded-md shadow-md z-20 sidebar-note-menu"
            }
          >
            <button
              className="text-sm font-medium border-b border-gray-700 px-4 py-2 w-full text-left rounded-t-md hover:bg-gray-800 hover:text-white"
              onClick={() => {
                renameNote();
              }}
            >
              Rename&nbsp;&nbsp;&nbsp;
            </button>
            <button
              className="text-sm font-medium border-b border-gray-700 px-4 py-2 w-full text-left hover:bg-gray-800 hover:text-white"
              onClick={() => {
                shareNote(note);
                setMenuOpen(false);
                document.removeEventListener("mousedown", closeOpenMenus);
              }}
            >
              Share
            </button>
            <button
              className="text-sm font-medium px-4 py-2 w-full text-left rounded-b-md hover:bg-gray-800 hover:text-white"
              onClick={() => {
                deleteNote();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
