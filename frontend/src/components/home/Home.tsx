import Editor from "./editor/Editor";
import {useState, useCallback, useEffect, useRef} from "react";
import ShareNotePopup from "./ShareNotePopup";
import axios from "axios";
import {BACKEND_SERVER_DOMAIN} from "@/config";
import {useSelector} from "react-redux";
import _ from "lodash";
import ExampleDocument, {SlateDocumentType} from "@/utils/ExampleDocument";
import {Helmet} from "react-helmet";
import {useParams, useNavigate} from "react-router-dom";
import {createNote, updateNoteContent} from "@/services/note/note";
import {RootState} from "@/App";
import {NoteType} from "@/types/api";
import HomeSidebar from "./sidebar/HomeSidebar";
import Sidebar from "@/components/Sidebar";
import NoteStatus, {NOTE_STATUS, SavingState} from "./NoteStatus";

export default function Home() {
	let {noteid} = useParams(); /* from url: '/note/{noteid}' */
	let sidebarRef = useRef<HTMLDivElement>(null);
	let sidebarCtrlBtnRef = useRef<HTMLButtonElement>(null);
	const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.user);
	const [status, setStatus] = useState<SavingState | null>(null);
	const [note, setNote] = useState<NoteType | null>(null);
	const [document, setDocument] = useState<SlateDocumentType>(ExampleDocument);
	const [refreshNoteList, setRefreshNoteList] = useState(false);
	const [isNoteLoading, setIsNoteLoading] = useState(false);
	const [currentNoteID, setCurrentNoteID] = useState<string | null>(null);
	const [sharePopupNote, setSharePopupNote] = useState(false);
	const [shareNote, setShareNote] = useState<NoteType | null>(null);

	const saveNote = (content: SlateDocumentType, note: NoteType | null) => {
		setStatus(NOTE_STATUS.saving);
		window.onbeforeunload = function () {
			alert("Note is not yet saved. Please wait!");
			return true;
		};
		_sendReq(content, note);
	};

	async function updateNote(nid: string, title: string, content: SlateDocumentType) {
		const req = await updateNoteContent(user.token, nid, title, content);
		if (req.success) {
			let response = req.res as NoteType;
			setStatus(NOTE_STATUS.saved);
			if (note?.id === response.id) {
				setNote(req.res as NoteType);
			}
			window.onbeforeunload = null;
		} else {
			setStatus(NOTE_STATUS.failed);
		}
	}

	async function createNewNote(title: string, content: SlateDocumentType) {
		const req = await createNote(user.token, title, content);
		if (req.success) {
			let response = req.res as NoteType;
			setStatus(NOTE_STATUS.created);
			setCurrentNoteID(response.id);
			setNote(response);
			setRefreshNoteList(!refreshNoteList);
			window.onbeforeunload = null;
			navigate("/note/" + response.id);
		} else {
			setStatus(NOTE_STATUS.failed);
		}
	}

	const _sendReq = useCallback(
		_.debounce((content: SlateDocumentType, note: NoteType | null) => {
			/* debouce keeps the old variables data, it creates
        a snapshot. To use variables at runtime add as
        parameters. */
			let title = note ? note.title : "Untitled";
			if (user) {
				if (note) {
					// Update note
					updateNote(note.id, title, content);
				} else {
					// Create note
					createNewNote(title, content);
				}
			} else {
				setStatus(NOTE_STATUS.failed);
			}
		}, 2000),
		[note]
	);

	const openNote = useCallback(
		(n_id: NoteType["id"]) => {
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
						// Close the sidebar on mobile if open
						if (
							window.innerWidth < 768 &&
							sidebarRef.current &&
							sidebarCtrlBtnRef.current &&
							sidebarRef.current.getAttribute("aria-hidden") === "false"
						) {
							toggleSidebar();
						}
						setNote(response.data.data);
						try {
							setDocument(JSON.parse(response.data.data.content));
						} catch (e) {
							// TODO: Let user know that the note is corrupted
							setDocument(ExampleDocument);
						}
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
		},
		[navigate, user]
	);

	const closeSharePopup = () => {
		setSharePopupNote(false);
	};

	const openShareNote = (note: NoteType) => {
		setShareNote(note);
		setSharePopupNote(true);
	};

	const toggleSidebar = () => {
		if (sidebarRef.current && sidebarCtrlBtnRef.current) {
			let isSidebarOpen = sidebarRef.current.getAttribute("aria-hidden") === "false";
			// Toggle the aria labels
			sidebarRef.current.setAttribute("aria-hidden", isSidebarOpen ? "true" : "false");
			sidebarCtrlBtnRef.current.setAttribute("aria-expanded", isSidebarOpen ? "false" : "true");
		}
	};

	useEffect(() => {
		if (!user) {
			setNote(null);
			setDocument(ExampleDocument);
		} else {
			// Check if url has note id and no note is open
			if (noteid && !note) {
				openNote(noteid);
			}
		}
	}, [user, note, noteid, openNote]);

	return (
		<>
			<Helmet>
				<title>{note ? note.title + " | " : ""}Letsnote</title>
			</Helmet>
			<div className="App min-h-screen">
				<div className="mx-auto lg:flex w-full">
					<div ref={sidebarRef} id="sidebar" aria-hidden="false" className="sidebar-hide-able">
						<Sidebar
							component={
								<HomeSidebar
									currentNoteID={currentNoteID}
									refresh={refreshNoteList}
									openNote={openNote}
									openShareNote={openShareNote}
								/>
							}
						/>
					</div>
					<div className="min-h-screen w-full md:px-4 bg-gray-200 relative">
						{/*
						 * Toggle to close the sidebar
						 */}
						{user && (
							<div className="fixed top-0 left-0 lg:block lg:sticky lg:top-2 z-50 lg:-ml-4 lg:left-0 lg:h-0">
								<button
									className="sidebar-expand-btn"
									ref={sidebarCtrlBtnRef}
									aria-expanded="true"
									aria-controls="sidebar"
									onClick={toggleSidebar}
									title="Toggle Sidebar"
								>
									<span className="ic ic-white ic-double-arrow align-text-top"></span>
								</button>
							</div>
						)}
						{/*
						 * Editor area
						 */}
						<div className={isNoteLoading ? "blur-sm z-40" : "z-40"}>
							<Editor
								document={document}
								onChange={(value: SlateDocumentType) => {
									// Check if a change is made to document
									if (!_.isEqual(document, value)) {
										setDocument(value);
										if (user) {
											// If user is logged in then
											// save the note
											saveNote(value, note);
										} else {
											setStatus(null);
										}
									}
								}}
								key={note !== null ? note.id : ""}
								note={note}
							/>
							<NoteStatus status={status} isLoggedIn={user ? true : false} />
						</div>
						{isNoteLoading && (
							<div className="absolute z-30 top-0 left-0 h-full w-full text-center">
								<div className="lds-ripple">
									<div></div>
									<div></div>
								</div>
							</div>
						)}
					</div>
				</div>
				{/*
				 * Note sharing component
				 */}
				{shareNote !== null ? (
					<ShareNotePopup note={shareNote} closePopup={closeSharePopup} open={sharePopupNote} />
				) : note !== null ? (
					<ShareNotePopup note={note} closePopup={closeSharePopup} open={sharePopupNote} />
				) : (
					<></>
				)}
			</div>
		</>
	);
}
