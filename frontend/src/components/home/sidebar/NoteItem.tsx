import React from "react";
import {dateTimePretty} from "@/utils/TimeSince";
import axios from "axios";
import {BACKEND_SERVER_DOMAIN} from "@/config";
import {useSelector} from "react-redux";
import {NoteType} from "@/types/api";
import {RootState} from "@/App";
import {EditNoteNameDialog} from "./EditNameDialog";
import {NoteListItemType} from "@/types/note";

interface Props {
	note: NoteListItemType;
	openNote: (nid: NoteType["id"]) => void;
	shareNote: (note: NoteListItemType) => void;
	isActive: boolean;
}

export default function NoteItem({note, isActive, openNote, shareNote}: Props) {
	const optionsRef = React.useRef<HTMLDivElement>(null);
	const user = useSelector((state: RootState) => state.user);
	const [menuOpen, setMenuOpen] = React.useState(false);
	const editNameDialogRef = React.useRef<HTMLDivElement>(null);

	const closeMenu = (e: MouseEvent) => {
		if (
			!document.getElementById(note.id + "-option-box")?.contains(e.target as Node) &&
			!document.getElementById(note.id + "-option-btn")?.contains(e.target as Node)
		) {
			setMenuOpen(false);
		}
	};

	const deleteNote = () => {
		if (
			window.confirm(
				"Are you sure you want to delete this note?\nThis cannot be reversed.\n\nTitle: " +
					note.title +
					"\nCreated: " +
					dateTimePretty(note.created) +
					"\n"
			)
		) {
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: user.token,
				},
			};
			axios
				.delete(BACKEND_SERVER_DOMAIN + "/api/note/" + note.id + "/", config)
				.then(() => {
					// if (response.data.action) {
					//   refreshNotes();
					// }
					window.location.replace("/");
				})
				.catch(function (err) {
					console.log(err);
				});
		}
	};

	const closeEditNameDialog = () => {
		if (editNameDialogRef.current) {
			editNameDialogRef.current.setAttribute("aria-hidden", "true");
			editNameDialogRef.current.classList.remove("active");
		}
	};

	const renameNote = () => {
		if (editNameDialogRef.current) {
			editNameDialogRef.current.setAttribute("aria-hidden", "false");
			editNameDialogRef.current.classList.add("active");
		}
	};

	return (
		<div className="sidebar-notelist-item" aria-current={isActive}>
			<div
				aria-hidden="true"
				className="aria-hidden:scale-0 group scale-100 fixed inset-0 z-50"
				ref={editNameDialogRef}
			>
				<div className="fixed inset-0 bg-black/30 z-0" onClick={closeEditNameDialog}></div>
				<div className="group-[.active]:scale-100 group-[.active]:opacity-100 opacity-60 scale-90 fixed inset-0 flex place-items-center justify-center z-[60] transition-transform duration-150 ease-in">
					<EditNoteNameDialog note={note} closeFn={closeEditNameDialog} userToken={user.token} />
				</div>
			</div>
			<div
				className="flex-grow pr-2 py-2 cursor-pointer"
				onClick={() => {
					openNote(note.id);
				}}
			>
				<div className="text-gray-900 max-w-12 text-ellipsis font-medium line-height-125 whitespace-nowrap overflow-hidden">
					<span className="active-badge">Active</span>
					{note.title}
				</div>
				<div className="text-xs mt-1 whitespace-nowrap overflow-hidden">
					{dateTimePretty(note.updated)}
				</div>
			</div>
			<div className="h-fit self-center relative">
				<button
					className="line-height-0 p-1 ml-2 cursor-pointer hover:rotate-90 focus:rotate-90 focus-within:rotate-90 transition-all rounded-md"
					id={note.id + "-option-btn"}
					aria-expanded={menuOpen}
					onClick={() => {
						setMenuOpen((val) => {
							if (val) {
								// menu will go away
								window.removeEventListener("click", closeMenu);
							} else {
								// menu will appear
								window.addEventListener("click", closeMenu);
							}
							return !val;
						});
					}}
				>
					<span className={"ic ic-md ic-gray-50 align-middle ic-options-vertical"}></span>
				</button>
				<div
					ref={optionsRef}
					aria-hidden={!menuOpen}
					id={note.id + "-option-box"}
					className="transition-all origin-bottom-right absolute right-8 -bottom-2 bg-gray-600 border border-gray-700 border-solid text-white rounded-md shadow-md z-20 sidebar-note-menu"
				>
					<button
						className="text-sm font-medium border-b border-gray-700 px-4 py-2 w-full text-left rounded-t-md hover:bg-gray-800 hover:text-white"
						onClick={() => {
							setMenuOpen(false);
							renameNote();
						}}
					>
						Rename&nbsp;&nbsp;&nbsp;
					</button>
					<button
						className="text-sm font-medium border-b border-gray-700 px-4 py-2 w-full text-left hover:bg-gray-800 hover:text-white"
						onClick={() => {
							shareNote(note);
							setMenuOpen(false);
							document.removeEventListener("mousedown", closeMenu);
						}}
					>
						Share
					</button>
					<button
						className="text-sm font-medium px-4 py-2 w-full text-left rounded-b-md hover:bg-gray-800 hover:text-white"
						onClick={() => {
							deleteNote();
						}}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
