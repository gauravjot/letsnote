import React from "react";
import { useSelector } from "react-redux";
import { BACKEND_SERVER_DOMAIN } from "../config";
import axios from "axios";
import ExampleDocument from "../utils/ExampleDocument";

export default function MakeNewNote({ onNewNoteCreated }) {
	const user = useSelector((state) => state.user);
	const [title, setTitle] = React.useState("");
	const [isCallingAPI, setIsCallingAPI] = React.useState(false);
	const [note, setNote] = React.useState([]);
	const [error, setError] = React.useState();

	const createNewNote = () => {
		setIsCallingAPI(true);
		if (user.token) {
			let config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: user.token,
				},
			};
			axios
				.post(
					BACKEND_SERVER_DOMAIN + "/api/note/create/",
					JSON.stringify({
						title: title,
						content: JSON.stringify(ExampleDocument),
					}),
					config
				)
				.then(function (response) {
					setNote(response.data);
					setIsCallingAPI(false);
					setTitle("");
					onNewNoteCreated(response.data);
				})
				.catch(function (error) {
					setIsCallingAPI(false);
				});
		}
	};

	const handleTitle = ({ target }) => {
		setTitle(target.value);
	};

	return user.token ? (
		<div className={isCallingAPI ? "opacity-50 grayscale" : ""}>
			<div className="font-sans px-4 pt-3 pb-4 border-b border-gray-300 bg-slate-700 shadow-black shadow-inner">
				<div className="font-normal tracking-wide text-[0.85rem] text-white text-opacity-80 mb-2">
					Creating new note
				</div>
				<input
					type="text"
					value={title}
					onChange={handleTitle}
					placeholder="Type note title here"
					className="rounded-md bg-slate-900 bg-opacity-70 border border-black border-opacity-80 font-normal tracking-wide w-full px-3 py-1.5 text-sm text-white outline-4 outline outline-transparent focus-visible:outline-[rgba(2,87,199,0.5)] focus-visible:bg-opacity-100 hover:outline-[rgba(0,99,230,0.2)]"
					disabled={isCallingAPI ? "disabled" : ""}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							createNewNote();
						}
					}}
				/>
				<button
					onClick={() => {
						createNewNote();
					}}
					className="ab-btn ab-btn-sm tracking-wide ab-btn-long mt-3 py-2"
					disabled={isCallingAPI ? "disabled" : ""}
				>
					Create
				</button>
			</div>
		</div>
	) : (
		""
	);
}
