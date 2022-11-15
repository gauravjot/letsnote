import Editor from "./editor/Editor";
import { useState, useCallback, useEffect } from "react";
import Login from "./user/Login";
import NoteList from "./NoteList";
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../config";
import { useSelector } from "react-redux";
import _ from "lodash";
import ExampleDocument from "../utils/ExampleDocument";

function Home() {
  const user = useSelector((state) => state.user);
  const [note, setNote] = useState(undefined);
  const [status, setStatus] = useState("");
  const [document, setDocument] = useState(ExampleDocument);
  const [error, setError] = useState();
  const [refreshNoteList, setRefreshNoteList] = useState(false);

  useEffect(() => {
    if (!user.token) {
      setNote(undefined);
      setDocument(ExampleDocument);
    }
  }, [user, note]);

  const saveNote = (content) => {
    setStatus(
      <>
        <span className="ic ic-cloud"></span>&nbsp; Saving...
      </>
    );
    _sendReq(content);
  };

  const _sendReq = useCallback(
    _.debounce((content) => {
      let title = note ? note.title : "Untitled";
      if (user.token) {
        let config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token,
          },
        };
        if (note) {
          // Update note
          axios
            .put(
              BACKEND_SERVER_DOMAIN + "/api/note/" + note.id + "/",
              JSON.stringify({ title: title, content: content }),
              config
            )
            .then(function (response) {
              setStatus(
                <>
                  <span className="ic ic-cloud-done"></span>&nbsp; Synced
                </>
              );
              setNote(response.data);
            })
            .catch(function (error) {
              setStatus(
                <>
                  <span className="ic ic-cloud-fail"></span>&nbsp; Sync fail:
                  {JSON.stringify(error.response.data)}
                </>
              );
              setError(error.response);
            });
        } else {
          // Create note
          axios
            .post(
              BACKEND_SERVER_DOMAIN + "/api/note/create/",
              JSON.stringify({ title: title, content: content }),
              config
            )
            .then(function (response) {
              setStatus(
                <>
                  <span className="ic ic-cloud-done"></span>&nbsp; Created
                </>
              );
              setNote(response.data);
              setRefreshNoteList(!refreshNoteList);
            })
            .catch(function (error) {
              setStatus(
                <>
                  <span className="ic ic-cloud-fail"></span>&nbsp; Sync fail:
                  {JSON.stringify(error.response.data)}
                </>
              );
              setError(error.response);
            });
        }
      }
    }, 2000),
    [note]
  );

  const openNote = (note) => {
    if (user.token) {
      let config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
      };
      axios
        .get(BACKEND_SERVER_DOMAIN + "/api/note/" + note.id + "/", config)
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
            <div className="h-screen bg-gray-100 block px-4 border-r border-gray-300 border-solid sticky top-0">
              <div className="font-serif font-bold text-3xl py-8">letsnote</div>
              <Login />
              <NoteList
                openNote={openNote}
                currentNote={note !== undefined ? note.id : null}
                refresh={refreshNoteList}
              />
            </div>
          </div>
          <div className="min-h-screen lg:col-span-9 md:px-4 bg-gray-200 relative">
            <Editor
              document={document}
              onChange={(value) => {
                setDocument(value);
                if (user.token) {
                  saveNote(JSON.stringify(value));
                } else {
                  setStatus(<></>);
                }
              }}
              key={note !== undefined ? note.id : ""}
              note={note}
            />
            {user.token ? (
              status !== "" ? (
                <div className="fixed bottom-0 right-0 bg-slate-800 shadow rounded-md px-2 py-1 font-medium text-sm text-white z-30 m-6">
                  {status}
                </div>
              ) : (
                ""
              )
            ) : (
              <div className="fixed bottom-0 right-0 bg-red-900 shadow rounded-md px-2 py-1 font-medium text-sm text-white z-30 m-6">
                <span className="ic ic-cloud-fail"></span>&nbsp; Sign-in to
                auto-save
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
