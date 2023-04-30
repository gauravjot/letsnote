import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../config";
import { timeSince, dateTimePretty } from "../utils/TimeSince";

export default function ShareNotePopup({ closePopup, note, open }) {
	const user = useSelector((state) => state.user);
	let sidebarRef = React.useRef();
	const [link, setLink] = React.useState();
	const [shareLinkList, setShareLinkList] = React.useState([]);
	const [title, setTitle] = React.useState("");
	const [anon, setAnon] = React.useState(true);
	const [isCallingAPI, setIsCallingAPI] = React.useState(false);
	const [isCallingGetLinksAPI, setIsCallingGetLinksAPI] =
		React.useState(false);

	React.useEffect(() => {
		setIsCallingGetLinksAPI(true);

		// sidebarRef.current.className =
		//   "w-transition w-full opacity-100 absolute h-full max-w-lg ml-8 mr-auto bg-white right-0 shadow-md p-4";
		setShareLinkList([]);
		let config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: user.token,
			},
		};
		axios
			.get(
				BACKEND_SERVER_DOMAIN +
					"/api/note/share/links/" +
					note.id +
					"/",
				config
			)
			.then(function (response) {
				setShareLinkList(response.data);
				setIsCallingGetLinksAPI(false);
			})
			.catch(function (error) {
				console.log(error);
				setIsCallingGetLinksAPI(false);
			});
	}, [user.token, note]);

	const createLink = () => {
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
				JSON.stringify({ title: title, anonymous: anon, expire: 0 }),
				config
			)
			.then(function (response) {
				shareLinkList.push({
					title: response.data.title,
					id: response.data.id,
					created: response.data.created,
					anonymous: response.data.anonymous,
				});
				setLink({
					title: response.data.title,
					urlkey: response.data.urlkey,
					expire: response.data.expire,
					anon: response.data.anonymous,
				});
				setIsCallingAPI(false);
			})
			.catch(function (error) {
				window.onbeforeunload = null;
				setIsCallingAPI(false);
			});
	};

	const handleTitle = ({ target }) => {
		setTitle(target.value);
	};

	const handleCheckBox = ({ target }) => {
		setAnon(target.checked);
	};

	return (
		<div
			aria-expanded={open}
			className="share-sidebar fixed top-0 left-0 w-full h-full bg-black bg-opacity-50"
		>
			<div
				ref={sidebarRef}
				className="absolute h-full ml-8 mr-auto bg-white right-0 shadow-md p-4"
			>
				<button
					className="ab-btn-secondary mt-4 px-2 text-sm font-medium py-1 rounded shadow"
					onClick={() => {
						// sidebarRef.current.className =
						//   "w-transition w-0 opacity-0 absolute h-full max-w-lg ml-8 mr-auto bg-white right-0 shadow-md p-4";
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
										onClick={() => {
											navigator.clipboard.writeText(
												BACKEND_SERVER_DOMAIN +
													"/note/shared/" +
													note.id.split("-")[0] +
													"/" +
													link.urlkey
											);
											document.querySelector(
												"#copy-button"
											).innerText = "Copied!";
										}}
									>
										Copy
									</button>
								</div>
								<div className="mt-2 mb-2 text-sm text-yellow-700">
									This is the only time you will see this
									link. Save it somewhere safe. You can make
									more in future.
								</div>
								<input
									type="text"
									className="w-full border border-gray-300 rounded py-1 px-2 bg-sky-100 text-sm"
									value={
										BACKEND_SERVER_DOMAIN +
										"/note/shared/" +
										note.id.split("-")[0] +
										"/" +
										link.urlkey
									}
									readOnly
								/>
								<div className="text-sm my-1 mt-2">
									Anonymous: {link.anon ? "Yes" : "No"}
								</div>
							</>
						) : (
							<div>
								<label
									className="user-select-none text-gray-600 pl-0.5 text-sm"
									htmlFor="title"
								>
									Group name
								</label>
								<input
									type="text"
									id="title"
									value={title}
									onChange={handleTitle}
									placeholder="friends, work, ..."
									className="mb-2 mt-1 rounded bg-gray-200 font-medium w-full px-3 py-1.5 text-sm text-gray-700 focus-visible:outline-gray-400"
									disabled={isCallingAPI ? "disabled" : ""}
								/>
								<label
									className="user-select-none text-sm text-gray-700 pl-0.5 pr-2"
									htmlFor="anon"
								>
									Share as anonymous
								</label>
								<input
									id="anon"
									type="checkbox"
									onChange={handleCheckBox}
									checked={anon}
								/>
								<button
									className="block mt-3 ab-btn ab-btn-sm"
									onClick={() => createLink()}
									disabled={isCallingAPI ? "disabled" : ""}
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
						<div className="font-bold mt-8 text-2xl pl-1 mb-2 text-gray-900 font-sans">
							Past Shares
						</div>
						<div className="overflow-y-auto max-h-80">
							{shareLinkList
								.slice(0)
								.reverse()
								.map((link) => {
									return (
										<div
											className="ab-link-share-row flex relative py-1 pb-1.5 hover:bg-gray-200 border-b border-gray-200"
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
														{dateTimePretty(
															link.created
														)}
													</span>
												)}
											</div>
											<div className="px-1 text-xs text-gray-500 mr-4 pt-0.5">
												{link.anonymous === true
													? "Anonymous"
													: ""}
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
	);
}