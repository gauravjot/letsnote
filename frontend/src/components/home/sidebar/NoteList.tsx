import React from "react";
import axios from "axios";
import {BACKEND_SERVER_DOMAIN} from "@/config";
import {useSelector} from "react-redux";
import CreateNote from "./CreateNote";
import NoteItem from "./NoteItem";
import {monthYear} from "@/utils/TimeSince";
import {NoteType} from "@/types/api";
import {RootState} from "@/App";
import Spinner from "@/components/ui/spinner/Spinner";

interface Props {
	refresh: boolean;
	currentNote: NoteType["id"] | null;
	openNote: (nid: NoteType["id"]) => void;
	shareNote: (note: NoteType) => void;
}

export default function NoteList({openNote, shareNote, currentNote, refresh}: Props) {
	const user = useSelector((state: RootState) => state.user);
	const [notes, setNotes] = React.useState<NoteType[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);
	const [showCreateBox, setShowCreateBox] = React.useState(false);

	// If user changes or refresh is trigger we need to fetch data
	React.useEffect(() => {
		setIsLoading(true);
		if (user) {
			let config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: user.token,
				},
			};
			axios
				.get(BACKEND_SERVER_DOMAIN + "/api/note/all", config)
				.then(function (response) {
					setNotes(response.data.data.reverse());
					setIsLoading(false);
				})
				.catch(function (error) {
					setIsLoading(false);
				});
		}
	}, [user, refresh]);

	const newNoteCreated = (note: NoteType) => {
		setShowCreateBox(false);
		setNotes([note, ...notes]);
		openNote(note.id);
	};

	let count: string;

	return user ? (
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
							setShowCreateBox(!showCreateBox);
						}}
						aria-selected={showCreateBox}
						className="infotrig sidebar-make-note-popup cursor-pointer"
					>
						<span className="ic-close inline-block align-baseline h-4 w-4 p-1 invert"></span>
						<div className="infomsg mt-2 bottom-7 right-0 whitespace-nowrap">
							{showCreateBox ? "Close" : "Make new note"}
						</div>
					</div>
				</div>
				<div
					className={
						(showCreateBox ? "max-h-40" : "max-h-0") +
						" basis-full transition-all duration-200 ease-linear overflow-hidden"
					}
				>
					<CreateNote onNewNoteCreated={newNoteCreated} />
				</div>
			</div>
			{notes.length > 0 ? (
				<div className="block relative notelist h-full overflow-y-auto overflow-x-hidden min-h-[24rem]">
					{notes.map((note) => {
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
			) : isLoading ? (
				<div className="flex justify-center">
					<Spinner color="primary" size="md" />
				</div>
			) : (
				<div className="px-6 py-4 text-xl text-gray-400 font-thin user-select-none">
					It's so empty here. Make a note in editor!
				</div>
			)}
		</div>
	) : (
		<></>
	);
}
