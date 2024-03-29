import {useContext, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {AxiosError} from "axios";
import {Helmet} from "react-helmet";
import useEditorConfig from "@/hooks/useEditorConfig";
// Slate
import {createEditor} from "slate";
import {Slate, Editable, withReact} from "slate-react";
import {dateTimePretty, timeSince} from "@/utils/DateTimeUtils";
import ErrorPage from "@/utils/ErrorPage";
import Sidebar from "@/features/sidebar/Sidebar";
import {UserContext} from "@/App";
import {useForm} from "react-hook-form";
import InputField from "../../components/ui/input/Input";
import Button from "../../components/ui/button/Button";
import {useQuery} from "react-query";
import {getSharedNote} from "@/services/note/get_shared_note";
import {handleAxiosError} from "@/utils/HandleAxiosError";

import "@/assets/css/editor.css";

export type ShareNoteApiResponseType = {
	noteTitle: string;
	noteContent: string;
	noteSharedBy: string;
	noteSharedByUID: string;
	noteSharedOn: string;
	noteCreated: string;
	noteUpdated: string;
};

export default function SharedPage() {
	const {shareid} = useParams();
	const user = useContext(UserContext).user;
	const [document, setDocument] = useState();
	const [error, setError] = useState<string | null>(null);
	const [response, setResponse] = useState<ShareNoteApiResponseType | null>(null);
	const [editor] = useState(() => withReact(createEditor()));
	const {renderLeaf, renderElement} = useEditorConfig(editor);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [password, setPassword] = useState("");

	const noteQuery = useQuery(
		["sharedNote", shareid, password],
		() => (shareid ? getSharedNote(shareid, password) : Promise.reject("No note exist.")),
		{
			onSuccess: (res) => {
				setDocument(JSON.parse(res.noteContent));
				setResponse(res);
				setError(null);
			},
			onError: (error: AxiosError) => {
				handleAxiosError(error, setError);
			},
			refetchOnWindowFocus: false,
			enabled: shareid ? true : false,
			retry: false,
		}
	);

	useEffect(() => {
		// if mobile toggle sidebar off
		if (window.innerWidth < 1024) {
			setIsSidebarOpen(false);
		}
	}, []);

	return (
		<>
			<Helmet>
				<title>{response ? response.noteTitle + " | " : ""}Letsnote</title>
			</Helmet>
			<div className="App min-h-screen">
				<div className="mx-auto lg:flex w-full">
					<div
						id="sidebar"
						aria-hidden={isSidebarOpen ? "false" : "true"}
						className="sidebar-hide-able"
					>
						<Sidebar
							component={
								<>
									<div className="m-4">
										<Link
											to={"/"}
											className="text-sm hover:underline hover:underline-offset-4 whitespace-nowrap overflow-hidden"
										>
											&#8592; Go back to editor
										</Link>
									</div>
									{response && (
										<div className="p-4 shadow-smb border-b border-gray-300">
											<div className="text-xl font-bold text-gray-900 mb-4">
												<span className="font-sans align-middle whitespace-nowrap overflow-hidden">
													Details
												</span>
											</div>
											{response.noteSharedBy !== undefined ? (
												<>
													<div className="text-sm font-medium text-gray-500 whitespace-nowrap overflow-hidden">
														Shared by
													</div>
													<div className="whitespace-nowrap overflow-hidden">
														{response.noteSharedBy}
													</div>
													<div className="text-xs mb-2 whitespace-nowrap overflow-hidden">
														{response.noteSharedByUID}
													</div>
												</>
											) : (
												<></>
											)}
											<div className="text-sm font-medium text-gray-500">Title</div>
											<div>{response.noteTitle}</div>
											<div className="text-sm mt-2 font-medium text-gray-500">Modified</div>
											<div className="whitespace-nowrap overflow-hidden">
												{timeSince(response.noteUpdated)}
											</div>
											<div className="text-sm mt-2 font-medium text-gray-500">Created</div>
											<div className="whitespace-nowrap overflow-hidden">
												{dateTimePretty(response.noteCreated)}
											</div>
											<div className="text-sm mt-2 font-medium text-gray-500">Shared</div>
											<div className="whitespace-nowrap overflow-hidden">
												{dateTimePretty(response.noteSharedOn)}
											</div>
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
												<li className="whitespace-nowrap overflow-hidden">&#8594; Make a copy</li>
											</ul>
										</div>
									)}
								</>
							}
						/>
					</div>

					<div className="min-h-screen bg-gray-200 w-full lg:flex-1 md:px-4 relative z-0">
						{/*
						 * Toggle to close the sidebar
						 */}

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
						<div className="fixed top-0 right-0 lg:hidden z-[51]">
							{isSidebarOpen && <div className="z-[40] fixed bg-black/20 inset-0"></div>}
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
						<div className="z-40">
							{noteQuery.isSuccess && document ? (
								<Slate editor={editor} initialValue={document}>
									<div className="editor-container">
										<div className="editor">
											<div role="textbox">
												<Editable readOnly renderElement={renderElement} renderLeaf={renderLeaf} />
											</div>
										</div>
									</div>
								</Slate>
							) : noteQuery.isError ? (
								<>
									<ErrorPage error={error} title="Err, something went wrong" />
								</>
							) : (
								<></>
							)}
						</div>
					</div>
				</div>
				{/** Password needed */}
				{(noteQuery.isError && error?.includes("N1401")) || error?.includes("N1402") ? (
					<PasswordPrompt setPassword={setPassword} error={error} />
				) : (
					<></>
				)}
			</div>
		</>
	);
}

function PasswordPrompt({
	setPassword,
	error,
}: {
	setPassword: (password: string) => void;
	error: string | null;
}) {
	const {
		register,
		handleSubmit,
		reset,
		formState: {errors},
	} = useForm();

	return (
		<div className="fixed inset-0 flex justify-center place-items-center z-[60]">
			<div className="bg-black/40 absolute inset-0"></div>
			<div className="max-w-[350px] py-4 px-5 w-4/5 bg-white rounded-2xl shadow-md relative z-10">
				<div className="mb-3">
					<h3 className="text-black select-none">Password required</h3>
				</div>
				{error && <p className="text-sm text-red-600 bg-red-100 px-2 mt-3 py-1 rounded">{error}</p>}
				<form
					onSubmit={handleSubmit((d) => {
						setPassword(d.password);
						reset();
					})}
				>
					<fieldset>
						<InputField
							elementId="password"
							elementLabel="Password"
							elementIsRequired={true}
							elementInputMaxLength={72}
							elementWidth="full"
							elementInputType="text"
							elementHookFormRegister={register}
							elementHookFormErrors={errors}
						/>

						<Button
							elementChildren="Proceed"
							elementState="default"
							elementStyle="primary"
							elementType="submit"
							elementWidth="full"
						/>
					</fieldset>
				</form>
			</div>
		</div>
	);
}
