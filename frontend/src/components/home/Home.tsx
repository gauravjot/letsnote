import Editor from "./editor/Editor";
import { useState, useCallback, useEffect, useRef, ReactNode } from "react";
import Login from "components/home/sidebar/Login";
import NoteList from "components/home/sidebar/NoteList";
import ShareNotePopup from "./ShareNotePopup";
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "config";
import { useSelector } from "react-redux";
import _ from "lodash";
import ExampleDocument, { SlateNodeType } from "utils/ExampleDocument";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import { createNote, updateNoteContent } from "lib/note/note";
import { RootState } from "App";
import { NoteType } from "types/api";

function Home() {
	let { noteid } = useParams();
	let sidebarRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.user);
	const [note, setNote] = useState<NoteType | null>(null);
	const [status, setStatus] = useState<ReactNode>("");
	const [document, setDocument] = useState<SlateNodeType[]>(ExampleDocument);
	const [refreshNoteList, setRefreshNoteList] = useState(false);
	const [isNoteLoading, setIsNoteLoading] = useState(false);
	const [currentNoteID, setCurrentNoteID] = useState<string | null>(null);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [sharePopupNote, setSharePopupNote] = useState(false);
	const [shareNote, setShareNote] = useState<NoteType | null>(null);

	const savingStatus = (
		<>
			<span className="ic align-middle ic-cloud"></span>&nbsp; Saving...
		</>
	);

	useEffect(() => {
		if (!user) {
			setNote(null);
			setDocument(ExampleDocument);
		}
		if (noteid && !note) {
			openNote(noteid);
		}
	}, [user, note]);

	const saveNote = (content: string) => {
		setStatus(savingStatus);
		window.onbeforeunload = function () {
			alert("Note is not yet saved. Please wait!");
			return true;
		};
		if (note) {
			_sendReq(content, note.id);
		}
	};

	async function updateNote(note: string, title: string, content: string) {
		const req = await updateNoteContent(user.token, note, title, content);
		if (req.success) {
			setStatus(
				<>
					<span className="ic align-middle ic-cloud-done"></span>
					&nbsp; Synced
				</>
			);
			if (note === req.res.id) {
				setNote(req.res);
			}
			window.onbeforeunload = null;
		} else {
			setStatus(
				<>
					<span className="ic align-middle ic-cloud-fail"></span>
					&nbsp; Sync fail:
					{JSON.stringify(req.res)}
				</>
			);
		}
	}

	async function createNewNote(title: string, content: string) {
		const req = await createNote(user.token, title, content);
		if (req.success) {
			setStatus(
				<>
					<span className="ic align-middle ic-cloud-done"></span>
					&nbsp; Created
				</>
			);
			setCurrentNoteID(req.res.id);
			setNote(req.res);
			setRefreshNoteList(!refreshNoteList);
			window.onbeforeunload = null;
			navigate("/note/" + req.res.id);
		} else {
			setStatus(
				<>
					<span className="ic align-middle ic-cloud-fail"></span>
					&nbsp; Sync fail:
					{JSON.stringify(req.res)}
				</>
			);
		}
	}

	const _sendReq = useCallback(
		_.debounce((content, currentNoteID) => {
			/* debouce keeps the old variables data, it creates
        a snapshot. To use variables at runtime add as
        parameters. */
			let title = note ? note.title : "Untitled";
			if (user.token) {
				if (note) {
					// Update note
					updateNote(currentNoteID, title, content);
				} else {
					// Create note
					createNewNote(title, content);
				}
			}
		}, 2000),
		[note]
	);

	const openNote = (n_id: string) => {
		if (user) {
			setIsNoteLoading(true);
			setCurrentNoteID(n_id);
			let config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: user.token,
				},
			};
			axios
				.get(BACKEND_SERVER_DOMAIN + "/api/note/" + n_id + "/", config)
				.then(function (response) {
					setNote(response.data);
					setDocument(JSON.parse(response.data.content));
					setIsNoteLoading(false);
					navigate("/note/" + n_id);
				})
				.catch(function (error) {
					setIsNoteLoading(false);
					if (error.response.data.code === "N0404") {
						// Note not found
						navigate("/");
					}
				});
		} else {
			navigate("/");
		}
	};

	const closeSharePopup = () => {
		setSharePopupNote(false);
	};

	const openShareNote = (note: NoteType) => {
		setShareNote(note);
		setSharePopupNote(true);
	};

	const toggleSidebar = () => {
		if (sidebarRef.current) {
			if (sidebarOpen) {
				sidebarRef.current.className = "w-transition w-0 opacity-0 z-20";
			} else {
				sidebarRef.current.className =
					"w-transition opacity-100 lg:w-sidebar z-20";
			}
			setSidebarOpen(!sidebarOpen);
		}
	};

	return (
		<>
			<Helmet>
				<title>{note ? note.title + " | " : ""}Letsnote</title>
			</Helmet>
			<div className="App min-h-screen">
				<div className="mx-auto lg:flex w-full">
					<div
						ref={sidebarRef}
						className="w-transition opacity-100 lg:w-sidebar z-20"
					>
						<div className="h-screen max-h-screen overflow-y-auto min-w-0 w-full bg-white block border-r border-gray-300 border-solid sticky top-0">
							<div className="p-5 border-b border-gray-300 shadow-smb">
								<span className="font-sans font-black tracking-tighter text-[1.75rem] py-0.5">
									letsnote.io
								</span>
							</div>
							<Login />
							<NoteList
								openNote={openNote}
								shareNote={openShareNote}
								currentNote={
									currentNoteID !== undefined ? currentNoteID : null
								}
								refresh={refreshNoteList}
							/>
						</div>
					</div>
					<div className="min-h-screen w-full md:px-4 bg-gray-200 relative z-40">
						{/*
						 * Toggle to close the sidebar
						 */}
						{user ? (
							<div className="hidden lg:block sticky top-2 z-40 -ml-4 left-0 h-0">
								<button
									className={
										"border-1 hover:bg-gray-500 px-2 py-1 pt-2 w-8 shadow-md border-t border-r border-b rounded-tr-md rounded-br-md border-solid border-gray-300" +
										(sidebarOpen ? " bg-gray-400" : " bg-gray-600")
									}
									onClick={toggleSidebar}
								>
									<span
										className={
											"ic ic-double-arrow align-text-top" +
											(sidebarOpen ? " rotate-180" : "")
										}
									></span>
								</button>
							</div>
						) : (
							""
						)}
						<div className={isNoteLoading ? "blur-sm z-40" : "z-40"}>
							<Editor
								document={document}
								onChange={(value: SlateNodeType[]) => {
									if (!_.isEqual(document, value)) {
										setDocument(value);
										if (user.token) {
											saveNote(JSON.stringify(value));
										} else {
											setStatus(<></>);
										}
									}
								}}
								key={note !== null ? note.id : ""}
								note={note}
							/>
							{user ? (
								status !== "" ? (
									<div className="fixed bottom-0 right-0 bg-slate-800 shadow rounded-md px-2 py-1 font-medium text-sm text-white z-30 m-6">
										{status}
									</div>
								) : (
									""
								)
							) : (
								<div className="fixed bottom-0 right-0 bg-red-900 shadow rounded-md px-2 py-1 font-medium text-sm text-white z-30 m-6">
									<span className="ic align-middle ic-cloud-fail"></span>
									&nbsp; Sign-in to auto-save
								</div>
							)}
						</div>
						{isNoteLoading ? (
							<div className="absolute z-30 top-0 left-0 h-full w-full text-center">
								<div className="lds-ripple">
									<div></div>
									<div></div>
								</div>
							</div>
						) : (
							""
						)}
					</div>
				</div>
				{shareNote !== null ? (
					<ShareNotePopup
						note={shareNote}
						closePopup={closeSharePopup}
						open={sharePopupNote}
					/>
				) : note !== null ? (
					<ShareNotePopup
						note={note}
						closePopup={closeSharePopup}
						open={sharePopupNote}
					/>
				) : (
					<></>
				)}
			</div>
		</>
	);
}

export default Home;
