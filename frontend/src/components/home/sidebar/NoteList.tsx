import React, {useContext} from "react";
import CreateNote from "./CreateNote";
import NoteItem from "./NoteItem";
import {monthYear} from "@/utils/DateTimeUtils";
import {NoteType} from "@/types/api";
import {UserContext} from "@/App";
import Spinner from "@/components/ui/spinner/Spinner";
import {useQuery} from "react-query";
import {NoteListItemType} from "@/types/note";
import {SIDEBAR_NOTES_QUERY} from "@/services/queries";
import {getNoteList} from "@/services/note/get_note_list";

interface Props {
	currentNote: NoteType["id"] | null;
	openNote: (nid: NoteType["id"]) => void;
	shareNote: (note: NoteListItemType) => void;
}

export default function NoteList({openNote, shareNote, currentNote}: Props) {
	const userContext = useContext(UserContext);
	const [showCreateBox, setShowCreateBox] = React.useState(false);
	const notes = useQuery(
		[SIDEBAR_NOTES_QUERY, userContext.user],
		() => getNoteList(userContext?.user?.token),
		{
			enabled: !!userContext.user,
		}
	);

	const newNoteCreated = (note: NoteType) => {
		setShowCreateBox(false);
		notes.refetch();
		openNote(note.id);
	};

	let count: string;

	return userContext.user ? (
		<div className="bg-white">
			<div className="relative mt-6 user-select-none flex flex-wrap">
				<div className="flex-1 ml-6 mb-2.5">
					<span className="font-sans text-black text-lg align-middle whitespace-nowrap overflow-hidden font-bold">
						Notes
					</span>
				</div>
				<div className="flex-none h-max mr-4">
					<div
						onClick={() => {
							if (!showCreateBox) {
								setTimeout(() => {
									document?.getElementById("create_new_note_title")?.focus();
								}, 150);
							}
							setShowCreateBox(!showCreateBox);
						}}
						aria-selected={showCreateBox}
						className="infotrig sidebar-make-note-popup cursor-pointer"
					>
						<span className="ic ic-close inline-block align-baseline h-4 w-4 p-1 invert"></span>
						<div className="infomsg bottom-1.5 right-10 whitespace-nowrap">
							{showCreateBox ? "Close" : "Make new note"}
						</div>
					</div>
				</div>
				<div
					className={
						(showCreateBox ? "max-h-44" : "max-h-0") +
						" basis-full transition-all duration-200 ease-linear overflow-hidden"
					}
				>
					<CreateNote onNewNoteCreated={newNoteCreated} />
				</div>
			</div>
			{notes.isSuccess && notes.data.length > 0 ? (
				<div className="block relative notelist h-full overflow-y-auto overflow-x-hidden min-h-[24rem]">
					{notes.data.map((note) => {
						return (
							<div key={note.id}>
								{monthYear(note.updated) !== count ? (
									<div className="sticky top-0 z-10 text-xs text-gray-600 font-medium bg-gray-200 border-b border-gray-300 px-6 py-1.5 pb-1 tracking-wide user-select-none whitespace-nowrap overflow-hidden">
										{(count = monthYear(note.updated))}
									</div>
								) : (
									""
								)}
								<NoteItem
									note={note}
									openNote={openNote}
									shareNote={shareNote}
									isActive={note.id === currentNote}
								/>
							</div>
						);
					})}
				</div>
			) : notes.isSuccess && notes.data.length === 0 ? (
				<div className="px-6 py-4 text-xl text-gray-400 font-thin user-select-none">
					It's so empty here. Make a note in editor!
				</div>
			) : notes.isLoading ? (
				<div className="flex justify-center">
					<Spinner color="primary" size="md" />
				</div>
			) : notes.isError ? (
				<div className="px-6 py-4 text-xl text-gray-400 font-thin user-select-none">
					Unable to fetch notes. Please reload page try again.
				</div>
			) : (
				<></>
			)}
		</div>
	) : (
		<></>
	);
}
