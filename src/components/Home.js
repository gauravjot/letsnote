import Editor from "./editor/Editor";
import { useState, useCallback, useEffect } from "react";
import Login from "./user/Login";
import NoteList from "./NoteList";
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../config";
import { useSelector } from "react-redux";
import _ from "lodash";
import ExampleDocument from "../utils/ExampleDocument";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";

function Home() {
  let { noteid } = useParams();
  let navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [note, setNote] = useState(undefined);
  const [status, setStatus] = useState("");
  const [document, setDocument] = useState(ExampleDocument);
  const [error, setError] = useState();
  const [refreshNoteList, setRefreshNoteList] = useState(false);
  const [isNoteLoading, setIsNoteLoading] = useState(false);
  const [currentNoteID, setCurrentNoteID] = useState();

  useEffect(() => {
    if (!user.token) {
      setNote(undefined);
      setDocument(ExampleDocument);
    }
    if (noteid && !note) {
      openNote({ id: noteid });
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
    _.debounce((content, currentNoteID) => {
      /* debouce keeps the old variables data, it creates
        a snapshot. To use variables at runtime add as
        parameters. */
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
              if (currentNoteID === response.data.id) {
                setNote(response.data);
              }
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
              if (!currentNoteID) {
                setCurrentNoteID(response.data.id);
              }
              if (currentNoteID === response.data.id) {
                setNote(response.data);
              }
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
      setIsNoteLoading(true);
      setCurrentNoteID(note.id);
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
          setIsNoteLoading(false);
          navigate("/note/" + note.id);
        })
        .catch(function (error) {
          setError(error.response);
          setIsNoteLoading(false);
        });
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <Helmet>
        <title>{note ? "Letsnote: " + note.title : "Letsnote"}</title>
      </Helmet>
      <div className="App min-h-screen">
        <div className="xl:container mx-auto lg:grid lg:grid-cols-12 w-100">
          <div className="lg:col-span-3">
            <div className="h-screen bg-gray-100 block px-4 border-r border-gray-300 border-solid sticky top-0">
              <div className="font-serif font-bold text-3xl py-8">letsnote</div>
              <Login />
              <NoteList
                openNote={openNote}
                currentNote={currentNoteID !== undefined ? currentNoteID : null}
                refresh={refreshNoteList}
              />
            </div>
          </div>
          <div className="min-h-screen lg:col-span-9 md:px-4 bg-gray-200 relative">
            <div className={isNoteLoading ? "blur-sm" : ""}>
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
            {isNoteLoading ? (
              <div className="absolute z-30 top-0 left-0 h-full w-full text-center">
                <div className="lds-ripple">
                  <div></div>
                  <div></div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
