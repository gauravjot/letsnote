import React from "react";
import {dateTimePretty, timeSince} from "@/utils/TimeSince";
import axios from "axios";
import {BACKEND_SERVER_DOMAIN} from "@/config";
import {useSelector} from "react-redux";
import {NoteType} from "@/types/api";
import {RootState} from "@/App";
import TitleUpdateDialog from "./TitleUpdateDialog";
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
	const [isRenameDialogOpen, setIsRenameDialogOpen] = React.useState(false);

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

	const closeEditNameDialog = () => setIsRenameDialogOpen(false);

	const renameNote = () => setIsRenameDialogOpen(true);

	return (
		<div className="sidebar-notelist-item" aria-current={isActive}>
			{isRenameDialogOpen && (
				<div className="fixed inset-0 z-50">
					<div className="fixed inset-0 bg-black/30 z-0" onClick={closeEditNameDialog}></div>
					<div className="fixed inset-0 flex place-items-center justify-center z-[60]">
						<TitleUpdateDialog note={note} closeFn={closeEditNameDialog} userToken={user.token} />
					</div>
				</div>
			)}
			<div
				className="flex-grow pr-2 py-2 cursor-pointer overflow-hidden"
				onClick={() => {
					openNote(note.id);
				}}
			>
				<div className="text-gray-900 font-medium line-height-125 truncate overflow-hidden whitespace-nowrap overflow-ellipsis">
					{note.title}
				</div>

				<div className="text-xs mt-1 whitespace-nowrap overflow-hidden">
					<span className="active-badge">Active</span>
					<span title={`Modified ${timeSince(note.updated)}`}>{dateTimePretty(note.updated)}</span>
				</div>
			</div>
			<div className="h-fit self-center relative">
				<button
					className="line-height-0 p-1 ml-2 cursor-pointer group hover:rotate-90 focus:rotate-90 focus:scale-150 focus-within:rotate-90 transition-all rounded-md"
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
					<span
						className={
							"ic ic-md ic-gray-50 group-hover:invert-0 group-focus:invert-0 align-middle ic-options-vertical"
						}
					></span>
				</button>
				<div
					ref={optionsRef}
					aria-hidden={!menuOpen}
					id={note.id + "-option-box"}
					className={
						"transition-transform origin-bottom-right absolute right-8 -bottom-2" +
						" bg-white border border-gray-300 shadow-md border-solid" +
						" rounded-lg shadow-lg z-20 sidebar-note-menu p-2 flex flex-col gap-1"
					}
				>
					<button
						className={
							"min-w-28 text-sm font-medium pr-3 pl-2 py-2 md:py-1.5 lg:py-1 w-full text-left rounded" +
							" hover:outline hover:outline-2 hover:outline-primary-500 focus-within:bg-primary-100" +
							" text-gray-600 hover:text-gray-800 flex place-items-center gap-2.5"
						}
						onClick={() => {
							setMenuOpen(false);
							setTimeout(() => {
								document?.getElementById("editnotename")?.focus();
							}, 100);
							renameNote();
						}}
					>
						<span className="ic ic-edit"></span>
						<span>Rename</span>
					</button>
					<button
						className={
							"text-sm font-medium pr-3 pl-2 py-2 md:py-1.5 lg:py-1 w-full text-left rounded" +
							" hover:outline hover:outline-2 hover:outline-primary-500 focus-within:bg-primary-100" +
							" text-gray-600 hover:text-gray-800 flex place-items-center gap-2.5"
						}
						onClick={() => {
							shareNote(note);
							setMenuOpen(false);
							document.removeEventListener("mousedown", closeMenu);
						}}
					>
						<span className="ic ic-share"></span>
						<span>Share</span>
					</button>
					<button
						className={
							"text-sm font-medium pr-3 pl-2 py-2 md:py-1.5 lg:py-1 w-full text-left rounded" +
							" hover:outline hover:outline-2 hover:outline-primary-500 focus-within:bg-primary-100" +
							" text-gray-600 hover:text-gray-800 flex place-items-center gap-2.5"
						}
						onClick={() => {
							deleteNote();
						}}
					>
						<span className="ic ic-delete"></span>
						<span>Delete</span>
					</button>
				</div>
			</div>
		</div>
	);
}
