import Editor from "./Editor";
import ExampleDocument from "../utils/ExampleDocument";
import React from "react";
import { useState } from "react";
import Sidebar from "./Sidebar";

function Home() {
  const [document, updateDocument] = useState(ExampleDocument);

  return (
    <>
      <div className="App min-h-screen">
        <div className="sm:container mx-auto lg:grid lg:grid-cols-12 w-100">
          <div className="lg:col-span-3">
            <Sidebar />
          </div>
          <div className="min-h-screen lg:col-span-9 md:px-4">
            <Editor document={document} onChange={updateDocument} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
