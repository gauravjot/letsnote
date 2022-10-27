import React from "react";
import Login from "./user/Login";

export default function Sidebar() {
  return (
    <div className="h-screen block px-4 border-r border-gray-300 border-solid sticky top-0">
      <div className="font-mono font-bold text-2xl py-8">letsnote</div>
      <Login />
    </div>
  );
}
