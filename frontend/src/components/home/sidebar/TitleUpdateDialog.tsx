import Button from "@/components/ui/button/Button";
import InputField from "@/components/ui/input/Input";
import {editNoteTitle} from "@/services/note/edit_note_title";
import {SIDEBAR_NOTES_QUERY} from "@/services/queries";
import {NoteListItemType} from "@/types/note";
import {handleAxiosError} from "@/utils/HandleAxiosError";
import {AxiosError} from "axios";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";
import {dateTimePretty} from "@/utils/TimeSince";

export interface IEditNoteNameDialogProps {
	note: NoteListItemType;
	closeFn: () => void;
	userToken: string;
}

export default function TitleUpdateDialog(props: IEditNoteNameDialogProps) {
	const [error, setError] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		reset,
		formState: {errors},
	} = useForm();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (payload: {editnotename: string}) => {
			return editNoteTitle(props.userToken, props.note.id, {title: payload.editnotename});
		},
		onSuccess: () => {
			setError(null);
			reset();
			queryClient.invalidateQueries(SIDEBAR_NOTES_QUERY);
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
					<h3 className="text-black select-none">Edit Note Title</h3>
					<Button
						elementChildren="Close"
						elementIcon="close"
						elementType="button"
						elementState="default"
						elementStyle="white_border"
						elementSize="xsmall"
						elementIconOnly={true}
						onClick={closeDialog}
					/>
				</div>
				<p className="text-sm font-medium text-gray-800 mb-px select-none">Selected Note</p>
				<p className="text-sm text-gray-500">{props.note.title}</p>
				<p className="text-sm text-gray-500">Updated on {dateTimePretty(props.note.updated)}</p>
				{error && <p className="text-sm text-red-600 bg-red-100 px-2 mt-3 py-1 rounded">{error}</p>}
				{mutation.isSuccess && (
					<p className="text-sm text-green-700 bg-green-100 px-2 py-1 mt-3 rounded flex place-items-center gap-2">
						<span className="ic ic-success ic-done"></span>
						<p>Title is updated.</p>
					</p>
				)}
				{!mutation.isSuccess ? (
					<form
						onSubmit={handleSubmit((d) => {
							mutation.mutate({editnotename: d.editnotename});
						})}
					>
						<fieldset disabled={mutation.isLoading}>
							<InputField
								elementId="editnotename"
								elementLabel="New Note Title"
								elementIsRequired={true}
								elementInputMaxLength={100}
								elementWidth="full"
								elementInputType="text"
								elementHookFormRegister={register}
								elementHookFormErrors={errors}
								defaultValue={props.note.title}
							/>

							<Button
								elementChildren="Save"
								elementState={
									mutation.isLoading ? "loading" : mutation.isSuccess ? "done" : "default"
								}
								elementStyle="primary"
								elementType="submit"
								elementDisabled={mutation.isLoading}
								elementWidth="full"
							/>
						</fieldset>
					</form>
				) : (
					<div className="mt-5">
						<Button
							elementChildren="Close"
							elementState="default"
							elementStyle="white_border"
							elementType="button"
							elementWidth="full"
							onClick={closeDialog}
						/>
					</div>
				)}
			</div>
		</>
	);
}
