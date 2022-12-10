import Editor from "./editor/Editor";
import { useState, useCallback, useEffect, useRef } from "react";
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
  let sidebarRef = useRef();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [note, setNote] = useState(undefined);
  const [status, setStatus] = useState("");
  const [document, setDocument] = useState(ExampleDocument);
  const [error, setError] = useState();
  const [refreshNoteList, setRefreshNoteList] = useState(false);
  const [isNoteLoading, setIsNoteLoading] = useState(false);
  const [currentNoteID, setCurrentNoteID] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const savingStatus = (
    <>
      <span className="ic align-middle ic-cloud"></span>&nbsp; Saving...
    </>
  );

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
    setStatus(savingStatus);
    window.onbeforeunload = function () {
      alert("Note is not yet saved. Please wait!");
      return true;
    };
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
                  <span className="ic align-middle ic-cloud-done"></span>&nbsp;
                  Synced
                </>
              );
              if (currentNoteID === response.data.id) {
                setNote(response.data);
              }
              window.onbeforeunload = null;
            })
            .catch(function (error) {
              setStatus(
                <>
                  <span className="ic align-middle ic-cloud-fail"></span>&nbsp;
                  Sync fail:
                  {JSON.stringify(error.response.data)}
                </>
              );
              setError(error.response.data);
              window.onbeforeunload = null;
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
                  <span className="ic align-middle ic-cloud-done"></span>&nbsp;
                  Created
                </>
              );
              setCurrentNoteID(response.data.id);
              setNote(response.data);
              setRefreshNoteList(!refreshNoteList);
              window.onbeforeunload = null;
              navigate("/note/" + response.data.id);
            })
            .catch(function (error) {
              setStatus(
                <>
                  <span className="ic align-middle ic-cloud-fail"></span>&nbsp;
                  Sync fail:
                  {JSON.stringify(error.response.data)}
                </>
              );
              setError(error.response.data);
              window.onbeforeunload = null;
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
          if (error.response.data.code === "N0404") {
            // Note not found
            navigate("/");
          }
        });
    } else {
      navigate("/");
    }
  };

  const toggleSidebar = () => {
    if (sidebarRef.current) {
      if (sidebarOpen) {
        sidebarRef.current.className = "w-transition w-0";
      } else {
        sidebarRef.current.className = "w-transition lg:w-sidebar";
      }
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <>
      <Helmet>
        <title>{note ? note.title + " | " : ""}Letsnote</title>
      </Helmet>
      <div className="App min-h-screen">
        <div className="mx-auto lg:flex w-full">
          <div ref={sidebarRef} className="w-transition lg:w-sidebar">
            <div className="h-screen w-full min-w-min bg-gray-100 block px-4 border-r border-gray-300 border-solid sticky top-0">
              <div className="font-serif font-bold text-3xl py-8">letsnote</div>
              <Login />
              <NoteList
                openNote={openNote}
                currentNote={currentNoteID !== undefined ? currentNoteID : null}
                refresh={refreshNoteList}
              />
            </div>
          </div>
          <div className="min-h-screen w-full md:px-4 bg-gray-200 relative">
            {/*
             * Toggle to close the sidebar
             */}
            {user.token ? (
              <div className="sticky top-2 z-40 -ml-4 left-0 h-0">
                <button
                  className={
                    "border-1 px-2 py-1 pt-2 w-8 shadow-md border-t border-r border-b rounded-tr-md rounded-br-md border-solid border-gray-300" +
                    (sidebarOpen ? " bg-gray-400" : " bg-gray-600")
                  }
                  onClick={toggleSidebar}
                >
                  <span
                    className={
                      "ic ic-double-arrow align-text-top" +
                      (sidebarOpen ? " rotate-180" : "")
                    }
                  ></span>
                </button>
              </div>
            ) : (
              ""
            )}
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
                  <span className="ic align-middle ic-cloud-fail"></span>&nbsp;
                  Sign-in to auto-save
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
