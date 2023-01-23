import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../../config";
import { Helmet } from "react-helmet";
import useEditorConfig from "../../hooks/useEditorConfig";
// Slate
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { dateTimePretty, timeSince } from "../../utils/TimeSince";
import ErrorPage from "../../utils/ErrorPage";

export default function Shared() {
  let { nui, shareid } = useParams();
  const [document, setDocument] = React.useState();
  const [error, setError] = React.useState();
  const [response, setResponse] = React.useState();
  const [editor] = React.useState(() => withReact(createEditor()));
  const { renderLeaf, renderElement } = useEditorConfig(editor);

  React.useEffect(() => {
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .get(
        BACKEND_SERVER_DOMAIN + "/api/note/shared/" + nui + "/" + shareid + "/",
        config
      )
      .then(function (response) {
        setDocument(JSON.parse(response.data.noteContent));
        setResponse(response.data);
      })
      .catch(function (error) {
        setError(error.response.data);
      });
  }, []);
  return (
    <>
      <Helmet>
        <title>{response ? response.noteTitle + " | " : ""}Letsnote</title>
      </Helmet>
      <div className="App min-h-screen">
        <div className="mx-auto lg:flex w-full">
          {error ? (
            <>
              <ErrorPage error={error} />
            </>
          ) : (
            <></>
          )}
          {response ? (
            <>
              <div className="w-transition opacity-100 lg:w-sidebar z-20">
                <div className="h-screen min-w-0 w-full bg-gray-100 block px-4 border-r border-gray-300 border-solid sticky top-0">
                  <div className="font-serif font-bold text-3xl py-8">
                    letsnote
                  </div>

                  <div className="text-xl font-bold text-gray-900 pl-2 mt-6 mb-2">
                    <span className="font-sans align-middle whitespace-nowrap overflow-hidden">
                      Details
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-md shadow p-3 mt-2">
                    {response.noteSharedBy !== undefined ? (
                      <>
                        <div className="text-sm font-medium text-gray-500">
                          Shared by
                        </div>
                        <div>{response.noteSharedBy}</div>
                        <div className="text-xs mb-2">
                          {response.noteSharedByUID}
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    <div className="text-sm font-medium text-gray-500">
                      Title
                    </div>
                    <div>{response.noteTitle}</div>
                    <div className="text-sm mt-2 font-medium text-gray-500">
                      Last modified
                    </div>
                    <div>{timeSince(response.noteUpdated)}</div>
                    <div className="text-sm mt-2 font-medium text-gray-500">
                      Created
                    </div>
                    <div>{dateTimePretty(response.noteCreated)}</div>
                    <div className="text-sm mt-2 font-medium text-gray-500">
                      Shared on
                    </div>
                    <div>{dateTimePretty(response.noteSharedOn)}</div>
                  </div>
                </div>
              </div>
              <div className="min-h-screen w-full md:px-4 bg-gray-200 relative z-40">
                <div className="z-40">
                  {document ? (
                    <Slate editor={editor} value={document}>
                      <div className="editor-container">
                        <div className="editor">
                          <div role="textbox">
                            <Editable
                              readOnly
                              renderElement={renderElement}
                              renderLeaf={renderLeaf}
                            />
                          </div>
                        </div>
                      </div>
                    </Slate>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
