import React from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {BACKEND_SERVER_DOMAIN} from "@/config";
import {Helmet} from "react-helmet";
import useEditorConfig from "@/hooks/useEditorConfig";
// Slate
import {createEditor} from "slate";
import {Slate, Editable, withReact} from "slate-react";
import {dateTimePretty, timeSince} from "@/utils/TimeSince";
import ErrorPage from "@/utils/ErrorPage";
import Sidebar from "@/components/Sidebar";
import LoginRegister from "@/components/home/sidebar/LoginRegister";
import {useSelector} from "react-redux";

export type ShareNoteApiResponseType = {
	noteTitle: string;
	noteContent: string;
	noteSharedBy: string;
	noteSharedByUID: string;
	noteSharedOn: string;
	noteCreated: string;
	noteUpdated: string;
};

export default function Shared() {
	const {nui, shareid} = useParams();
	const user = useSelector((state: any) => state.user);
	const [document, setDocument] = React.useState();
	const [error, setError] = React.useState();
	const [response, setResponse] = React.useState<ShareNoteApiResponseType | null>(null);
	const [editor] = React.useState(() => withReact(createEditor()));
	const {renderLeaf, renderElement} = useEditorConfig(editor);
	const sidebarRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		axios
			.get(BACKEND_SERVER_DOMAIN + "/api/note/shared/" + nui + "/" + shareid + "/", config)
			.then(function (response) {
				setDocument(JSON.parse(response.data.data.noteContent));
				setResponse(response.data.data);
			})
			.catch(function (error) {
				setError(error.response.data);
			});
		// if mobile toggle sidebar off
		if (window.innerWidth < 1024) {
			sidebarRef.current?.setAttribute("aria-hidden", "true");
		}
	}, [nui, shareid]);

	const toggleSidebar = () => {
		if (sidebarRef.current) {
			const isSidebarOpen = sidebarRef.current.getAttribute("aria-hidden") === "false";
			// Toggle the aria labels
			sidebarRef.current.setAttribute("aria-hidden", isSidebarOpen ? "true" : "false");
		}
	};

	return (
		<>
			<Helmet>
				<title>{response ? response.noteTitle + " | " : ""}Letsnote</title>
			</Helmet>
			<div className="App min-h-screen">
				<div className="mx-auto lg:flex w-full">
					<div ref={sidebarRef} id="sidebar" aria-hidden="false" className="sidebar-hide-able">
						<Sidebar
							component={
								<div>
									<LoginRegister showLinkToHome={true} />
									{response && (
										<div className="p-4 shadow-smb border-b border-gray-300">
											<div className="text-xl font-bold text-gray-900 mb-4">
												<span className="font-sans align-middle whitespace-nowrap overflow-hidden">
													Details
												</span>
											</div>
											{response.noteSharedBy !== undefined ? (
												<>
													<div className="text-sm font-medium text-gray-500">Shared by</div>
													<div>{response.noteSharedBy}</div>
													<div className="text-xs mb-2">{response.noteSharedByUID}</div>
												</>
											) : (
												<></>
											)}
											<div className="text-sm font-medium text-gray-500">Title</div>
											<div>{response.noteTitle}</div>
											<div className="text-sm mt-2 font-medium text-gray-500">Last modified</div>
											<div>{timeSince(response.noteUpdated)}</div>
											<div className="text-sm mt-2 font-medium text-gray-500">Created</div>
											<div>{dateTimePretty(response.noteCreated)}</div>
											<div className="text-sm mt-2 font-medium text-gray-500">Shared on</div>
											<div>{dateTimePretty(response.noteSharedOn)}</div>
										</div>
									)}
									{user && (
										<div className="p-4 shadow-smb border-b border-gray-300">
											<div className="text-xl font-bold text-gray-900 mb-4">
												<span className="font-sans align-middle whitespace-nowrap overflow-hidden">
													Actions
												</span>
											</div>
											<ul>
												<li>&#8594; Make a copy</li>
											</ul>
										</div>
									)}
								</div>
							}
						/>
					</div>
					{/*
					 * Toggle to close the sidebar
					 */}
					{
						<div className="fixed top-0 right-0 lg:right-auto lg:sticky lg:top-2 z-[55] lg:left-0 lg:h-0">
							<button
								className="sidebar-expand-btn mobile-sidebar-toggle"
								aria-expanded={
									sidebarRef?.current?.getAttribute("aria-hidden") === "true" ? "false" : "true"
								}
								aria-controls="sidebar"
								onClick={(e) => {
									e.currentTarget.setAttribute(
										"aria-expanded",
										e.currentTarget.getAttribute("aria-expanded") === "true" ? "false" : "true"
									);
									toggleSidebar();
								}}
								title="Toggle Sidebar"
							>
								<span className="ic ic-white ic-double-arrow align-text-top !hidden lg:!inline-block"></span>
								<div className="hamburger-wrapper lg:hidden">
									<div className="hamburger-line half first"></div>
									<div className="hamburger-line"></div>
									<div className="hamburger-line half last"></div>
								</div>
							</button>
						</div>
					}
					<div className="min-h-screen w-full lg:flex-1 md:px-4 relative z-40">
						<div className="z-40">
							{document ? (
								<Slate editor={editor} value={document}>
									<div className="editor-container">
										<div className="editor">
											<div role="textbox">
												<Editable readOnly renderElement={renderElement} renderLeaf={renderLeaf} />
											</div>
										</div>
									</div>
								</Slate>
							) : error ? (
								<>
									<ErrorPage error={error} />
								</>
							) : (
								<></>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
