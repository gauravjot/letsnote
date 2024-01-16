import React from "react";
import { useSelector } from "react-redux";
import { NoteType } from "@/types/api";
import { RootState } from "@/App";
import { createNote } from "@/services/note/note";
import { ApiError } from "../../../types/query";

export default function CreateNote({
	onNewNoteCreated,
}: {
	onNewNoteCreated: (note: NoteType) => void;
}) {
	const user = useSelector((state: RootState) => state.user);
	const [inputFieldValue, setInputFieldValue] = React.useState<string>("");
	const [isCallingAPI, setIsCallingAPI] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const createNewNote = async () => {
		setIsCallingAPI(true);
		setError(null);
		if (user) {
			const req = await createNote(user.token, inputFieldValue);
			if (req.success) {
				let response = req.res as NoteType;
				setInputFieldValue("");
				onNewNoteCreated(response);
			} else {
				let response = req.res as ApiError;
				setError(`Error ${response.statusCode}: ${response.message}`);
			}
			setIsCallingAPI(false);
		}
	};

	return (
		<div className="font-sans px-4 pt-3 pb-4 border-b border-gray-300 bg-slate-700 shadow-black shadow-inner">
			<div className="font-normal tracking-wide text-[0.85rem] text-white text-opacity-80 mb-2">
				Creating new note
			</div>
			<input
				type="text"
				value={inputFieldValue}
				onChange={(self) => {
					setInputFieldValue(self.target.value);
				}}
				placeholder="Type note title here"
				className="rounded-md bg-slate-900 bg-opacity-70 border border-black border-opacity-80 font-normal tracking-wide w-full px-3 py-1.5 text-sm text-white outline-4 outline outline-transparent focus-visible:outline-[rgba(2,87,199,0.5)] focus-visible:bg-opacity-100 hover:outline-[rgba(0,99,230,0.2)]"
				disabled={isCallingAPI}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						createNewNote();
					}
				}}
			/>
			<div className="flex mt-3">
				<div>
					<button
						onClick={() => {
							createNewNote();
						}}
						className="flex-none ab-btn ab-btn-sm tracking-wide ab-btn-long py-2"
						disabled={isCallingAPI}
					>
						{isCallingAPI ? "Creating..." : "Create"}
					</button>
				</div>
				{error && (
					<div className="ml-3 flex place-items-center text-red-300 text-sm">
						{error}
					</div>
				)}
			</div>
		</div>
	);
}
