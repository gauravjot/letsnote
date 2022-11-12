import React from "react";
import Login from "./user/Login";
import NoteList from "./NoteList";

export default function Sidebar({ openNote, currentNote }) {
  return (
    <div className="h-screen bg-gray-100 block px-4 border-r border-gray-300 border-solid sticky top-0">
      <div className="font-serif font-bold text-3xl py-8">letsnote</div>
      <Login />
      <NoteList openNote={openNote} currentNote={currentNote} />
    </div>
  );
}
