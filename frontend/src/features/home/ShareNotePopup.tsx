import {useCallback, useContext, useEffect, useState} from "react";
import {AxiosError} from "axios";
import {DEPLOY_DOMAIN} from "@/config";
import {timeSince} from "@/utils/DateTimeUtils";
import {ShareNote} from "@/types/api";
import {NoteListItemType} from "@/types/note";
import {UserContext} from "@/App";
import InputField from "@/components/ui/input/Input";
import {useForm} from "react-hook-form";
import Button from "@/components/ui/button/Button";
import {useMutation, useQuery} from "react-query";
import {ShareNoteQueryType, shareNoteQuery} from "@/services/note/create_share_link";
import {handleAxiosError} from "@/utils/HandleAxiosError";
import {getNoteShares} from "@/services/note/get_note_shares";
import {DisableShareLinkType, disableShareLinkQuery} from "@/services/note/disable_share_link";
import CheckBox from "@/components/ui/checkbox/CheckBox";
import Spinner from "@/components/ui/spinner/Spinner";

interface Props {
	note: NoteListItemType;
	closePopup: () => void;
	open: boolean;
}

export default function ShareNotePopup({closePopup, note, open}: Props) {
	const userContext = useContext(UserContext);
	const shareLinkForm = useForm();
	const [shareNoteQueryError, setShareNoteQueryError] = useState<string | null>(null);
	const [passProtect, setPassProtect] = useState(false);

	const shareListQuery = useQuery(["shareList", note.id], () => getNoteShares(note.id), {
		refetchOnWindowFocus: false,
	});

	const shareNoteMutation = useMutation({
		mutationFn: (payload: ShareNoteQueryType) => {
			return userContext && userContext.user
				? shareNoteQuery(note.id, payload)
				: Promise.reject("User authentication error. Logout and login again to retry.");
		},
		onSuccess: () => {
			setShareNoteQueryError(null);
			shareListQuery.refetch();
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setShareNoteQueryError);
		},
	});

	const closeFn = useCallback(() => {
		closePopup();
		setTimeout(() => {
			shareNoteMutation.reset();
			setShareNoteQueryError(null);
			shareLinkForm.reset();
		}, 1000);
	}, [closePopup, shareNoteMutation, shareLinkForm]);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				closeFn();
			}
		}
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [closeFn]);

	return (
		<div aria-expanded={open} className="share-sidebar">
			{open && <div className="bg-black/30 inset-0 fixed z-0" onClick={closeFn}></div>}
			<div className="share-sidebar-content">
				<div className="px-4 lg:px-6 h-screen flex flex-col">
					<div>
						<div className="absolute top-4 right-4 bg-white z-20">
							<Button
								elementChildren="Close"
								elementState="default"
								elementStyle="white_no_border"
								elementSize="xsmall"
								elementType="button"
								elementIcon="ic-close"
								elementIconOnly={true}
								elementIconSize="md"
								onClick={closeFn}
							/>
						</div>
						<h2 className="pt-9 lg:pt-7 mb-4">Share note</h2>
						<p className="mt-6 text-gray-900 font-medium text-md tracking-wide">{note.title}</p>
						<p className="mt-1 text-gray-500 text-bb tracking-wide">
							Last updated {timeSince(note.updated)}
						</p>
						<div>
							<div>
								{shareNoteMutation.isSuccess ? (
									<>
										<div className="mt-6 text-gray-900 font-medium text-md tracking-wide">
											Your link is ready
										</div>
										<div className="mt-3 py-1 px-2 text-sm text-yellow-800 bg-yellow-100">
											This is the only time you will see this link. Save it somewhere safe. You can
											make more in future.
										</div>
										<div className="flex gap-2 mt-4">
											<input
												type="text"
												className="w-full border border-gray-400 rounded-md py-1.5 px-2 bg-gray-100 text-bb focus-visible:outline-none"
												value={DEPLOY_DOMAIN + "/shared/" + shareNoteMutation.data.urlkey}
												readOnly
											/>
											<button
												id="copy-button"
												className="text-primary-600 text-sm font-bold uppercase border border-primary-500 px-2 py-0.5 rounded-md shadow-sm hover:bg-primary-50 hover:outline hover:outline-primary-200"
												onClick={(self) => {
													navigator.clipboard.writeText(
														DEPLOY_DOMAIN + "/shared/" + shareNoteMutation.data.urlkey
													);
													self.currentTarget.innerHTML = "Copied!";
												}}
											>
												Copy
											</button>
										</div>
										<div className="text-sm mt-3 text-gray-600 flex gap-2">
											<span className="text-gray-700 font-medium">Anonymous:</span>
											<span>{shareNoteMutation.data.anonymous ? "Yes" : "No"}</span>
										</div>
										<div className="text-sm mt-1.5 text-gray-600 flex gap-2">
											<span className="text-gray-700 font-medium">Password Protected:</span>
											<span>{shareNoteMutation.data.isPasswordProtected ? "Yes" : "No"}</span>
										</div>
									</>
								) : (
									<>
										<h3 className="text-bb font-medium py-px mt-8 text-gray-800 border-b">
											Share with
										</h3>
										{shareNoteQueryError && (
											<p className="mx-4 mt-4 text-red-700 text-sm">{shareNoteQueryError}</p>
										)}

										<form
											className="mx-2"
											onSubmit={shareLinkForm.handleSubmit((d) => {
												shareNoteMutation.mutate({
													title: d.title,
													anonymous: d.anon,
													active: true,
													password: d.password ? d.password : null,
												});
											})}
										>
											<fieldset disabled={shareNoteMutation.isLoading}>
												<InputField
													elementId="title"
													elementInputType="text"
													elementLabel=""
													elementIsRequired={false}
													placeholder="friends, work, ..."
													elementWidth="full"
													elementHookFormRegister={shareLinkForm.register}
												/>
												<div className="mt-4 flex place-items-center">
													<label
														className="select-none cursor-pointer text-sm text-gray-700 pl-0.5 pr-2"
														htmlFor="pass_protect"
													>
														Password protect the link
													</label>
													<input
														className="cursor-pointer"
														id="pass_protect"
														type="checkbox"
														checked={passProtect}
														onChange={(e) => setPassProtect(e.target.checked)}
													/>
												</div>
												{passProtect && (
													<InputField
														elementId="password"
														elementInputType="password"
														elementLabel=""
														elementIsRequired={false}
														elementHookFormRegister={shareLinkForm.register}
													/>
												)}
												<CheckBox
													elementId="anon"
													elementLabel="Share as anonymous"
													elementHookFormRegister={shareLinkForm.register}
												/>
												<Button
													elementChildren="Get Share Link"
													elementState={shareNoteMutation.isLoading ? "loading" : "default"}
													elementStyle="primary"
													elementType="submit"
												/>
											</fieldset>
										</form>
									</>
								)}
							</div>
						</div>
					</div>
					<div className="flex-1 flex flex-col h-full overflow-auto">
						{shareListQuery.isSuccess ? (
							<>
								<h2 className="pt-7 pb-2">Past Shares</h2>
								<div className="flex-1 overflow-y-auto	h-full">
									{shareListQuery.data.length > 0 ? (
										shareListQuery.data.map((link) => {
											return <ShareLinkItem link={link} key={link.id} />;
										})
									) : (
										<p className="mt-4 text-gray-600 text-sm">
											The links you create to share will appear here!
										</p>
									)}
								</div>
							</>
						) : shareListQuery.isLoading ? (
							<div className="flex justify-center py-12">
								<Spinner color="primary" size="sm" />
							</div>
						) : shareListQuery.isError ? (
							<p className="mx-4 mt-4 text-red-700 text-sm">
								Some error prevented fetching past shares
							</p>
						) : (
							<></>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function ShareLinkItem({link}: {link: ShareNote}) {
	const userContext = useContext(UserContext);

	const disableShareLinkMutation = useMutation({
		mutationFn: (payload: DisableShareLinkType) => {
			return userContext && userContext.user
				? disableShareLinkQuery(payload)
				: Promise.reject("User authentication error. Logout and login again to retry.");
		},
	});

	return (
		<div
			className="last:mb-4 flex items-center py-0.5 pl-2 gap-3 border-b border-gray-100 whitespace-nowrap overflow-hidden"
			key={link.id}
		>
			<div className="grid md:grid-cols-4 md:gap-3 py-4 lg:py-0 flex-1 truncate">
				<div className="col-span-1 text-xs text-gray-500">{timeSince(link.created)}</div>
				<div className="col-span-2 text-sm flex gap-1 place-items-center truncate">
					{link.isPasswordProtected ? (
						<span
							className="ic ic-green !size-3 lg:!size-3.5 ic-lock"
							title="Password Protected"
						></span>
					) : (
						<></>
					)}
					{link.title ? (
						link.title
					) : (
						<span className="text-gray-500 text-xs truncate">no title</span>
					)}
				</div>
				<div className="col-span-1 text-xs text-gray-500">{link.anonymous ? "Anonymous" : ""}</div>
			</div>
			<div className="col-span-1 text-right pr-2">
				<Button
					elementChildren={
						disableShareLinkMutation.isSuccess || !link.active ? "Disabled" : "Disable"
					}
					elementState={disableShareLinkMutation.isLoading ? "loading" : "default"}
					elementDisabled={disableShareLinkMutation.isSuccess || !link.active}
					elementStyle={disableShareLinkMutation.isSuccess || !link.active ? "black" : "danger"}
					elementInvert={true}
					elementType="button"
					elementSize="xsmall"
					onClick={() => disableShareLinkMutation.mutate({id: link.id})}
				/>
			</div>
		</div>
	);
}
