import React from "react";
import { dateTimePretty } from "../utils/TimeSince";
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../config";
import { useSelector } from "react-redux";

export default function NoteItem({
  note,
  openNote,
  currentNote,
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
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
    };
    axios
      .delete(BACKEND_SERVER_DOMAIN + "/api/note/" + note.id + "/", config)
      .then(function (response) {
        if (response.data.action) {
          refreshNotes();
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const renameNote = () => {};

  return (
    <div>
      <li
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
          <div className="text-gray-900 font-medium">{note.title}</div>
          <div className="text-xs">{dateTimePretty(note.updated)}</div>
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
              (menuOpen ? "" : "hidden ") +
              "absolute right-0 bg-white rounded-md shadow-md z-20"
            }
          >
            <button
              className="text-xs border-b px-3 py-1.5 w-full text-left rounded-t-md hover:bg-gray-500 hover:text-white"
              onClick={() => {
                renameNote();
              }}
            >
              rename&nbsp;&nbsp;&nbsp;
            </button>
            <button
              className="text-xs px-3 py-1.5 w-full text-left rounded-b-md hover:bg-gray-500 hover:text-white"
              onClick={() => {
                deleteNote();
              }}
            >
              delete
            </button>
          </div>
        </div>
      </li>
    </div>
  );
}
