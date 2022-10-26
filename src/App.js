import Editor from "./components/Editor";
import ExampleDocument from "./utils/ExampleDocument";
import React from "react";
import { useState } from "react";

function App() {
  const [document, updateDocument] = useState(ExampleDocument);

  return (
    <>
      <div className="App min-h-screen">
        <div className="sm:container mx-auto lg:grid lg:grid-cols-12 w-100">
          <div className="lg:col-span-3 xl:col-span-2">Sidebar</div>
          <div className="min-h-screen lg:col-span-9 xl:col-span-10 md:px-4">
            <Editor document={document} onChange={updateDocument} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
