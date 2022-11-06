import React from "react";
import { useSelector } from "react-redux";
import { BACKEND_SERVER_DOMAIN } from "../config";
import axios from "axios";
import ExampleDocument from "../utils/ExampleDocument";

export default function MakeNewNote() {
  const user = useSelector((state) => state.user);
  const [showCreateBox, setShowCreateBox] = React.useState("hidden");
  const [title, setTitle] = React.useState("");
  const [isCallingAPI, setIsCallingAPI] = React.useState(false);
  const [note, setNote] = React.useState([]);
  const [error, setError] = React.useState();

  const createNewNote = () => {
    console.log(title);
    setIsCallingAPI(true);
    if (user.token) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
      };
      axios
        .post(
          BACKEND_SERVER_DOMAIN + "/api/note/create/",
          JSON.stringify({
            title: title,
            content: JSON.stringify(ExampleDocument),
          }),
          config
        )
        .then(function (response) {
          setNote(response.data);
        })
        .catch(function (error) {
          setError(error.response);
        });
    }
  };

  const handleTitle = ({ target }) => {
    setTitle(target.value);
  };

  return user.token ? (
    <div className={isCallingAPI ? "opacity-50 grayscale" : ""}>
      <div
        className={
          showCreateBox + " rounded-md shadow-md bg-white px-3 py-3 mt-4"
        }
      >
        <div className="font-medium text-sm text-gray-500 mb-1">
          Creating new note
        </div>
        <input
          type="text"
          value={title}
          onChange={handleTitle}
          placeholder="Type note title here"
          className="rounded bg-gray-200 w-full px-3 py-1.5 mt-2 text-sm focus-visible:outline-gray-400"
          disabled={isCallingAPI ? "disabled" : ""}
        />
        <button
          onClick={() => {
            createNewNote();
          }}
          className="ab-btn ab-btn-xs ab-btn-long mt-2"
          disabled={isCallingAPI ? "disabled" : ""}
        >
          Create
        </button>
        <button
          onClick={() => {
            setTitle("");
            setShowCreateBox("hidden");
          }}
          className="ml-2 ab-btn ab-btn-secondary ab-btn-xs ab-btn-long mt-2"
          disabled={isCallingAPI ? "disabled" : ""}
        >
          Cancel
        </button>
      </div>
      <div
        onClick={() => {
          setShowCreateBox("block");
        }}
        className="hover:bg-slate-300 cursor-pointer mt-4 align-middle rounded-md border-2 border-dashed border-slate-400 py-1 px-3"
      >
        <span className="ic ic-add ic-black p-1 mb-1"></span>{" "}
        <span className="font-medium text-gray-600 ml-2">Create a note</span>
      </div>
    </div>
  ) : (
    ""
  );
}
