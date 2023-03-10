import React from "react";
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../config";
import { useSelector } from "react-redux";
import MakeNewNote from "./MakeNewNote";
import NoteItem from "./NoteItem";
import { monthYear } from "../utils/TimeSince";

export default function NoteList({
	openNote,
	shareNote,
	currentNote,
	refresh,
}) {
	const user = useSelector((state) => state.user);
	const [notes, setNotes] = React.useState([]);
	const [error, setError] = React.useState();
	const [showCreateBox, setShowCreateBox] = React.useState(false);

	React.useEffect(() => {
		refreshNotes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, refresh]);

	const refreshNotes = () => {
		if (user.token) {
			let config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: user.token,
				},
			};
			axios
				.get(BACKEND_SERVER_DOMAIN + "/api/note/all", config)
				.then(function (response) {
					setNotes(response.data.reverse());
				})
				.catch(function (error) {
					setError(error.response);
				});
		}
	};

	const newNoteCreated = (note) => {
		setShowCreateBox(false);
		setNotes([note, ...notes]);
		openNote(note);
	};

	let count;

	return user.token ? (
		<>
			<div className="text-xl font-bold text-gray-900 px-4 mt-6 mb-2 user-select-none flex">
				<div className="flex-grow">
					<span className="font-sans align-middle whitespace-nowrap overflow-hidden">
						Your Notes
					</span>
				</div>
				<div className="flex-grow-0 h-max">
					<div
						onClick={() => {
							setShowCreateBox(!showCreateBox);
						}}
						aria-selected={showCreateBox}
						className="sidebar-make-note-popup cursor-pointer"
					>
						<span className="ic-close ic-black inline-block align-baseline h-4 w-4 p-1 invert"></span>
					</div>
				</div>
			</div>
			<div
				className={
					(showCreateBox ? "max-h-36" : "max-h-0") +
					" transition-all duration-200 ease-linear overflow-hidden"
				}
			>
				<MakeNewNote onNewNoteCreated={newNoteCreated} />
			</div>
			{notes.length > 0 ? (
				<div className="block notelist mb-4 gap-1 min-h-fit min-h-64 h-[calc(100%-410px)] overflow-y-auto overflow-x-hidden">
					{notes.map((note) => {
						return (
							<div key={note.id}>
								{monthYear(note.updated) !== count ? (
									<div className="mt-2 text-xs text-gray-600 font-medium bg-gray-300 bg-opacity-50 border-b border-gray-300 px-6 py-1.5 pb-1 tracking-wide user-select-none whitespace-nowrap overflow-hidden">
										{(count = monthYear(note.updated))}
									</div>
								) : (
									""
								)}
								<NoteItem
									note={note}
									count={count}
									openNote={openNote}
									shareNote={shareNote}
									currentNote={currentNote}
									refreshNotes={refreshNotes}
								/>
							</div>
						);
					})}
				</div>
			) : (
				<div className="px-2 py-2 text-xl text-gray-400 font-thin user-select-none">
					It's so empty here. Make a note in editor!
				</div>
			)}
		</>
	) : (
		<></>
	);
}
