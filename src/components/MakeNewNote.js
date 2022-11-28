import React from "react";
import { useSelector } from "react-redux";
import { BACKEND_SERVER_DOMAIN } from "../config";
import axios from "axios";
import ExampleDocument from "../utils/ExampleDocument";

export default function MakeNewNote({ onNewNoteCreated }) {
  const user = useSelector((state) => state.user);
  const [title, setTitle] = React.useState("");
  const [isCallingAPI, setIsCallingAPI] = React.useState(false);
  const [note, setNote] = React.useState([]);
  const [error, setError] = React.useState();

  const createNewNote = () => {
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
          setIsCallingAPI(false);
          setTitle("");
          onNewNoteCreated(response.data);
        })
        .catch(function (error) {
          setIsCallingAPI(false);
          setError(error.response);
        });
    }
  };

  const handleTitle = ({ target }) => {
    setTitle(target.value);
  };

  return user.token ? (
    <div className={isCallingAPI ? "opacity-50 grayscale" : ""}>
      <div className="font-sans mb-4 mt-1">
        <div className="rounded-md border-gray-200 border-solid border shadow bg-white px-3 py-3">
          <div className="font-medium text-sm text-gray-500 mb-1">
            Creating new note
          </div>
          <input
            type="text"
            value={title}
            onChange={handleTitle}
            placeholder="Type note title here"
            className="rounded bg-gray-200 font-medium w-full px-3 py-1.5 mt-2 text-sm text-gray-700 focus-visible:outline-gray-300"
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
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
