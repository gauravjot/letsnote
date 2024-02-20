import Editor from "./editor/Editor";
import {useState, useCallback, useEffect, useContext} from "react";
import ShareNotePopup from "./ShareNotePopup";
import axios from "axios";
import {BACKEND_SERVER_DOMAIN} from "@/config";
import _ from "lodash";
import ExampleDocument, {SlateDocumentType} from "@/utils/ExampleDocument";
import {Helmet} from "react-helmet";
import {useParams, useNavigate} from "react-router-dom";
import {NoteType} from "@/types/api";
import HomeSidebar from "./sidebar/Sidebar";
import Sidebar from "@/components/Sidebar";
import NoteStatus, {SavingState} from "./NoteStatus";
import {NoteListItemType} from "@/types/note";
import {useMutation, useQueryClient} from "react-query";
import {SIDEBAR_NOTES_QUERY} from "@/services/queries";
import {updateNoteContent} from "@/services/note/update_note_content";
import {createNote} from "@/services/note/create_note";
import {NOTE_STATUS} from "./NoteStatusOptions";
import {UserContext} from "@/App";

export default function Home() {
	const {noteid} = useParams(); /* from url: '/note/{noteid}' */
	const navigate = useNavigate();
	const user = useContext(UserContext).user;
	const [status, setStatus] = useState<SavingState | null>(null);
	const [note, setNote] = useState<NoteType | null>(null);
	const [document, setDocument] = useState<SlateDocumentType>(ExampleDocument);
	const [isNoteLoading, setIsNoteLoading] = useState(false);
	const [sharePopupNote, setSharePopupNote] = useState(false);
	const [shareNote, setShareNote] = useState<NoteListItemType | null>(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const queryClient = useQueryClient();

	const updateNoteMutation = useMutation({
		mutationFn: (payload: {title: string; content: SlateDocumentType}) => {
			return user && note
				? updateNoteContent(user.token, note.id, payload)
				: Promise.reject("Note not found");
		},
		onSuccess: (res) => {
			const response = res as NoteType;
			if (note?.id === response.id) {
				setNote(response);
			}
			setTimeout(() => {
				setStatus(null);
			}, 1500);
			window.onbeforeunload = null;
		},
		onError: () => {
			setStatus(NOTE_STATUS.failed);
		},
	});

	const createNoteMutation = useMutation({
		mutationFn: (payload: {title: string; content: SlateDocumentType}) => {
			return user ? createNote(user.token, payload) : Promise.reject("User not found");
		},
		onSuccess: (res) => {
			setStatus(null);
			if (note?.id === res.id) {
				setNote(res);
			}
			navigate("/note/" + res.id);
			window.onbeforeunload = null;
			queryClient.invalidateQueries(SIDEBAR_NOTES_QUERY);
		},
		onError: () => {
			setStatus(NOTE_STATUS.failed);
		},
	});

	const saveNote = (content: SlateDocumentType, note: NoteType | null) => {
		setStatus(NOTE_STATUS.saving);
		const title = note ? note.title : "Untitled";
		if (user) {
			if (note) {
				// Update note
				updateNoteMutation.mutate({title, content});
			} else {
				// Create note
				createNoteMutation.mutate({title, content});
			}
		} else {
			setStatus(NOTE_STATUS.failed);
		}
	};

	const openNote = useCallback(
		(n_id: NoteType["id"]) => {
			if (user) {
				setIsNoteLoading(true);
				const config = {
					headers: {
						"Content-Type": "application/json",
						Authorization: user.token,
					},
				};
				axios
					.get(BACKEND_SERVER_DOMAIN + "/api/note/" + n_id + "/", config)
					.then(function (response) {
						// Close the sidebar on mobile if open
						if (window.innerWidth < 1024) {
							setIsSidebarOpen(false);
						}
						// smooth scroll to top
						window.scrollTo({top: 0, behavior: "smooth"});
						// set note
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

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const editorDebounced = useCallback(
		_.debounce(
			(value: SlateDocumentType) => {
				if (user) {
					// If user is logged in then save the note
					saveNote(value, note);
				} else {
					setStatus(null);
				}
			},
			2000,
			{leading: false, trailing: true, maxWait: 60000}
		),
		[note, user]
	);

	const handleEditorChange = useCallback(
		(value: SlateDocumentType) => {
			console.log(note);
			if (!_.isEqual(value, note ? JSON.parse(note?.content) : document)) {
				window.onbeforeunload = function () {
					alert("Note is not yet saved. Please wait!");
					return true;
				};
				editorDebounced(value);
			}
		},
		[editorDebounced, document, note]
	);

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
					<div id="sidebar" aria-hidden={!isSidebarOpen} className="sidebar-hide-able">
						<Sidebar
							component={
								<HomeSidebar
									currentNoteID={note !== null ? note.id : null}
									openNote={openNote}
									openShareNote={(note: NoteListItemType) => {
										setShareNote(note);
										setSharePopupNote(true);
									}}
								/>
							}
						/>
					</div>
					<div className="min-h-screen w-full md:px-4 bg-gray-200 relative z-0">
						{/*
						 * Toggle to close the sidebar
						 */}
						{user && (
							<>
								{/* arrow toggle on desktop */}
								<div className="hidden lg:block sticky top-2 right-auto z-50 -ml-4 left-0 h-0">
									<button
										className="sidebar-expand-btn"
										aria-expanded={isSidebarOpen ? "true" : "false"}
										aria-controls="sidebar"
										onClick={(e) => {
											const isOpen = isSidebarOpen ? false : true;
											setIsSidebarOpen(isOpen);
											e.currentTarget.setAttribute("aria-expanded", isOpen ? "false" : "true");
										}}
										title="Toggle Sidebar"
									>
										<span className="ic ic-white ic-double-arrow align-text-top"></span>
									</button>
								</div>
								{/* hambuger menu for mobile */}
								<div className="fixed top-0 right-0 lg:hidden z-[50]">
									{isSidebarOpen && <div className="z-[40] fixed bg-black/10 inset-0"></div>}
									<button
										className="mobile-sidebar-toggle relative z-[50]"
										aria-expanded={isSidebarOpen ? "true" : "false"}
										aria-controls="sidebar"
										onClick={(e) => {
											const isOpen = isSidebarOpen ? false : true;
											setIsSidebarOpen(isOpen);
											e.currentTarget.setAttribute("aria-expanded", isOpen ? "false" : "true");
										}}
										title="Toggle Mobile Sidebar"
									>
										<div className="hamburger-wrapper">
											<div className="hamburger-line half first"></div>
											<div className="hamburger-line"></div>
											<div className="hamburger-line half last"></div>
										</div>
									</button>
								</div>
							</>
						)}

						{/*
						 * Editor area
						 */}
						<div className={isNoteLoading ? "blur-sm z-40" : "z-40"}>
							<Editor
								document={document}
								onChange={handleEditorChange}
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
					<ShareNotePopup
						note={shareNote}
						closePopup={() => setSharePopupNote(false)}
						open={sharePopupNote}
					/>
				) : note !== null ? (
					<ShareNotePopup
						note={note}
						closePopup={() => setSharePopupNote(false)}
						open={sharePopupNote}
					/>
				) : (
					<></>
				)}
			</div>
		</>
	);
}
