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
			<div className="font-sans mb-4 mx-4 rounded mt-1 px-3 py-3 border-b border-gray-300 bg-gray-200 shadow-inner">
				<div className="font-medium text-[0.85rem] text-gray-500 mb-1">
					Creating new note
				</div>
				<input
					type="text"
					value={title}
					onChange={handleTitle}
					placeholder="Type note title here"
					className="rounded-md bg-white border border-gray-300 font-medium tracking-wide w-full px-3 py-1.5 mt-2 text-sm text-gray-900 outline-4 outline outline-transparent focus-visible:outline-[rgba(2,87,199,0.2)] hover:outline-gray-300"
					disabled={isCallingAPI ? "disabled" : ""}
				/>
				<button
					onClick={() => {
						createNewNote();
					}}
					className="ab-btn ab-btn-sm tracking-wide ab-btn-long mt-2 py-2"
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
