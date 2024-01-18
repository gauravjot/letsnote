import React from "react";
import {useSelector} from "react-redux";
import axios from "axios";
import {BACKEND_SERVER_DOMAIN, DEPLOY_DOMAIN} from "@/config";
import {timeSince, dateTimePretty} from "@/utils/TimeSince";
import {ShareNote, NoteType} from "@/types/api";
import {RootState} from "@/App";

interface Link {
	title: string;
	urlkey: string;
	expire: string;
	anon: boolean;
	active: boolean;
}

interface Props {
	note: NoteType;
	closePopup: () => void;
	open: boolean;
}

export default function ShareNotePopup({closePopup, note, open}: Props) {
	const user = useSelector((state: RootState) => state.user);
	const [link, setLink] = React.useState<Link | null>(null);
	const [shareLinkList, setShareLinkList] = React.useState<ShareNote[]>([]);
	const [title, setTitle] = React.useState("");
	const [anon, setAnon] = React.useState(true);
	const [isCallingAPI, setIsCallingAPI] = React.useState(false);
	const [isCallingGetLinksAPI, setIsCallingGetLinksAPI] = React.useState(false);

	React.useEffect(() => {
		let ignore = false;
		if (user) {
			setLink(null);
			setIsCallingGetLinksAPI(true);

			setShareLinkList([]);
			let config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: user.token,
				},
			};
			axios
				.get(BACKEND_SERVER_DOMAIN + "/api/note/share/links/" + note.id + "/", config)
				.then(function (response) {
					if (!ignore) {
						setShareLinkList(response.data.data);
						setIsCallingGetLinksAPI(false);
					}
				})
				.catch(function (error) {
					if (!ignore) {
						console.log(error);
						setIsCallingGetLinksAPI(false);
					}
				});
		}
		return () => {
			ignore = true;
		};
	}, [user, note.id]);

	const createLink = () => {
		if (user) {
			setIsCallingAPI(true);
			let config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: user.token,
				},
			};
			axios
				.post(
					BACKEND_SERVER_DOMAIN + "/api/note/share/" + note.id + "/",
					JSON.stringify({title: title, anonymous: anon, active: true}),
					config
				)
				.then(function (response) {
					setShareLinkList([
						{
							title: response.data.data.title,
							id: response.data.data.id,
							created: response.data.data.created,
							anonymous: response.data.data.anonymous,
							active: response.data.data.active,
						},
						...shareLinkList,
					]);
					setLink({
						title: response.data.data.title,
						urlkey: response.data.data.urlkey,
						expire: response.data.data.expire,
						anon: response.data.data.anonymous,
						active: response.data.data.active,
					});
					setIsCallingAPI(false);
				})
				.catch(() => {
					window.onbeforeunload = null;
					setIsCallingAPI(false);
				});
		}
	};

	return (
		<div aria-expanded={open} className="share-sidebar">
			{open && <div className="bg-black/30 inset-0 fixed z-0"></div>}
			<div className="share-sidebar-content fixed right-0 z-10 bg-white shadow-md h-full w-full">
				<div className="p-4">
					<button
						className="ab-btn-secondary mt-4 px-2 text-sm font-medium py-1 rounded shadow"
						onClick={() => {
							closePopup();
						}}
					>
						Close
					</button>
					<div className="text-gray-600 mt-8 text-sm">{note.title}</div>
					<div className="mb-1 mt-2 text-2xl font-bold text-gray-900 font-sans align-middle whitespace-nowrap overflow-hidden">
						Share Note
					</div>
					<div>
						<div>
							{link ? (
								<>
									<div className="font-sans mt-4 mb-2">
										Your link is ready.{" "}
										<button
											id="copy-button"
											className="text-sky-600 text-xs ml-2 border border-gray-200 px-2 rounded hover:bg-gray-200"
											onClick={(self) => {
												navigator.clipboard.writeText(
													DEPLOY_DOMAIN +
														"/note/shared/" +
														note.id.split("-")[0] +
														"/" +
														link.urlkey
												);
												self.currentTarget.innerHTML = "Copied!";
											}}
										>
											Copy
										</button>
									</div>
									<div className="mt-2 mb-2 text-sm text-yellow-700">
										This is the only time you will see this link. Save it somewhere safe. You can
										make more in future.
									</div>
									<input
										type="text"
										className="w-full border border-gray-300 rounded py-1 px-2 bg-sky-100 text-sm"
										value={
											DEPLOY_DOMAIN + "/note/shared/" + note.id.split("-")[0] + "/" + link.urlkey
										}
										readOnly
									/>
									<div className="text-sm my-1 mt-2">Anonymous: {link.anon ? "Yes" : "No"}</div>
								</>
							) : (
								<div>
									<label
										className="user-select-none text-gray-600 pl-0.5 text-sm whitespace-nowrap overflow-hidden"
										htmlFor="title"
									>
										Group name
									</label>
									<input
										type="text"
										id="title"
										value={title}
										onChange={(e) => {
											setTitle(e.target.value);
										}}
										placeholder="friends, work, ..."
										className="mb-2 mt-1 rounded bg-gray-200 font-medium w-full px-3 py-1.5 text-sm text-gray-700 focus-visible:outline-gray-400"
										disabled={isCallingAPI}
									/>
									<div className="whitespace-nowrap overflow-hidden">
										<label
											className="user-select-none text-sm text-gray-700 pl-0.5 pr-2 whitespace-nowrap overflow-hidden"
											htmlFor="anon"
										>
											Share as anonymous
										</label>
										<input
											id="anon"
											type="checkbox"
											onChange={(e) => {
												setAnon(e.target.checked);
											}}
											checked={anon}
										/>
									</div>
									<button
										className="block mt-3 ab-btn ab-btn-sm whitespace-nowrap overflow-hidden"
										onClick={() => createLink()}
										disabled={isCallingAPI}
									>
										Get Share Link
									</button>
								</div>
							)}
						</div>
					</div>
					{isCallingGetLinksAPI ? (
						<div className="w-full my-2 mt-16 text-center">
							<div className="anim-ripple">
								<div></div>
								<div></div>
							</div>
						</div>
					) : (
						<></>
					)}
					{shareLinkList.length > 0 ? (
						<div className="max-h-96">
							<div className="font-bold mt-8 text-2xl pl-1 mb-2 text-gray-900 font-sans whitespace-nowrap overflow-hidden">
								Past Shares
							</div>
							<div className="overflow-y-auto max-h-80">
								{shareLinkList.map((link) => {
									return (
										<div
											className="ab-link-share-row flex relative py-1 pb-1.5 hover:bg-gray-200 border-b border-gray-200 whitespace-nowrap overflow-hidden"
											key={link.id}
										>
											<div className="text-xs text-gray-500 pt-1 pl-2 mr-2 w-24">
												{timeSince(link.created)}
											</div>
											<div className="flex-grow px-1 text-sm pt-0.5">
												{link.title ? (
													link.title
												) : (
													<span className="text-gray-500 text-xs">
														{dateTimePretty(link.created)}
													</span>
												)}
											</div>
											<div className="px-1 text-xs text-gray-500 mr-4 pt-0.5">
												{link.anonymous === true ? "Anonymous" : ""}
											</div>
											<div className="ab-link-share-delete px-2 lg:absolute mr-3 right-0 top-0 bottom-0 bg-gradient-to-r from-transparent lg:to-gray-200 lg:pl-64 lg:hidden">
												<button
													className="bg-red-600 hover:bg-red-900 text-white px-2 py-1 rounded font-medium text-xs align-sub"
													onClick={() => {}}
												>
													Delete
												</button>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
}
