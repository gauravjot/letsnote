import Editor from "./editor/Editor";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../config";
import { useSelector } from "react-redux";
import ExampleDocument from "../utils/ExampleDocument";
import _ from "lodash";

function Home() {
  const user = useSelector((state) => state.user);
  const [document, updateDocument] = useState(ExampleDocument);
  const [title, setTitle] = useState("Untitled");
  const [note, setNote] = useState();
  const [error, setError] = useState();

  const saveNote = (content) => {
    _sendReq(content);
  };

  const _sendReq = _.debounce((content) => {
    updateDocument(content);
    if (user.token) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
      };
      axios
        .post(
          BACKEND_SERVER_DOMAIN +
            "/api/note/" +
            (note ? "update/" + note.id + "/" : "create/"),
          JSON.stringify({ title: title, content: content }),
          config
        )
        .then(function (response) {
          setNote(response.data);
        })
        .catch(function (error) {
          setError(error.response);
        });
    }
  }, 2000);

  return (
    <>
      <div className="App min-h-screen">
        <div className="xl:container mx-auto lg:grid lg:grid-cols-12 w-100">
          <div className="lg:col-span-3">
            <Sidebar />
          </div>
          <div className="min-h-screen lg:col-span-9 md:px-4">
            <Editor
              document={document}
              onChange={(value) => {
                saveNote(JSON.stringify(value));
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
