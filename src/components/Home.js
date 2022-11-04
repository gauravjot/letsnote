import Editor from "./editor/Editor";
import { useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../config";
import { useSelector } from "react-redux";
import _ from "lodash";
import ExampleDocument from "../utils/ExampleDocument";

function Home() {
  const user = useSelector((state) => state.user);
  const [note, setNote] = useState();
  const [document, setDocument] = useState(ExampleDocument);
  const [error, setError] = useState();

  const saveNote = (content) => {
    _sendReq(content);
  };

  const _sendReq = _.debounce((content) => {
    setDocument(JSON.parse(content));
    let title = note ? note.title : "Untitled";
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

  const openNote = (note) => {
    if (user.token) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
      };
      axios
        .get(BACKEND_SERVER_DOMAIN + "/api/note/read/" + note.id + "/", config)
        .then(function (response) {
          setNote(response.data);
          setDocument(JSON.parse(response.data.content));
        })
        .catch(function (error) {
          setError(error.response);
        });
    }
  };

  return (
    <>
      <div className="App min-h-screen">
        <div className="xl:container mx-auto lg:grid lg:grid-cols-12 w-100">
          <div className="lg:col-span-3">
            <Sidebar
              openNote={openNote}
              currentNote={note !== undefined ? note.id : null}
            />
          </div>
          <div className="min-h-screen lg:col-span-9 md:px-4">
            <Editor
              noteid={note ? note.id : null}
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
