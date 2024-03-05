import Button from "@/components/ui/button/Button";
import {SIDEBAR_NOTES_QUERY} from "@/services/queries";
import {NoteListItemType} from "@/types/note";
import {handleAxiosError} from "@/utils/HandleAxiosError";
import {AxiosError} from "axios";
import {useContext, useEffect, useState} from "react";
import {useMutation, useQueryClient} from "react-query";
import {dateTimePretty} from "@/utils/DateTimeUtils";
import {deleteNote} from "@/services/note/delete_note";
import {UserContext} from "@/App";

export interface IDeleteNoteDialogProps {
	note: NoteListItemType;
	closeFn: () => void;
	openNote: (nid: NoteListItemType["id"] | null) => void;
}

export default function DeleteNoteDialog(props: IDeleteNoteDialogProps) {
	const userContext = useContext(UserContext);
	const [error, setError] = useState<string | null>(null);
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: () => {
			return userContext.user ? deleteNote(props.note.id) : Promise.reject("User not logged in");
		},
		onSuccess: () => {
			setError(null);
			queryClient.invalidateQueries([SIDEBAR_NOTES_QUERY, userContext.user?.user.id]);
			props.openNote(null);
			closeDialog();
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setError);
		},
	});

	function closeDialog() {
		mutation.reset();
		props.closeFn();
	}

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				mutation.reset();
				props.closeFn();
			}
		}
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [mutation, props]);

	return (
		<>
			<div className="max-w-[350px] py-4 px-5 w-4/5 bg-white rounded-2xl shadow-md relative z-10">
				<div className="flex justify-between place-items-center mb-3">
					<h3 className="text-black select-none">Delete Note</h3>
					<Button
						elementChildren="Close"
						elementIcon="close"
						elementType="button"
						elementState="default"
						elementStyle="white_no_border"
						elementSize="xsmall"
						elementIconSize="base"
						elementIconOnly={true}
						onClick={closeDialog}
					/>
				</div>
				<p className="text-sm font-medium text-gray-800 mb-px select-none">Selected Note</p>
				<p className="text-sm text-gray-500">{props.note.title}</p>
				<p className="text-sm text-gray-500 mb-3">
					Updated on {dateTimePretty(props.note.updated)}
				</p>
				{error && <p className="text-sm text-red-600 bg-red-100 px-2 my-3 py-1 rounded">{error}</p>}
				{!mutation.isSuccess && (
					<form>
						<fieldset disabled={mutation.isLoading}>
							<Button
								elementChildren="DELETE NOTE"
								elementState={
									mutation.isLoading ? "loading" : mutation.isSuccess ? "done" : "default"
								}
								elementStyle="danger"
								elementType="submit"
								elementDisabled={mutation.isLoading}
								elementWidth="full"
								onClick={() => mutation.mutate()}
							/>
							<Button
								elementChildren="Cancel"
								elementState="default"
								elementStyle="white_border"
								elementType="button"
								elementWidth="full"
								onClick={closeDialog}
							/>
						</fieldset>
					</form>
				)}
			</div>
		</>
	);
}
