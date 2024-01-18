import Spinner from "../ui/spinner/Spinner";

export interface INoteStatusProps {
	status: SavingState | null;
	isLoggedIn: boolean;
}

export interface SavingState {
	icon: "ic-cloud" | "ic-cloud-done" | "ic-cloud-fail";
	color: "bg-slate-800" | "bg-green-800" | "bg-sky-600" | "bg-orange-700";
	message: string;
}

export const NOTE_STATUS: {[key: string]: SavingState} = {
	saving: {
		icon: "ic-cloud",
		color: "bg-slate-800",
		message: "Saving",
	},
	saved: {
		icon: "ic-cloud-done",
		color: "bg-green-800",
		message: "Saved",
	},
	created: {
		icon: "ic-cloud-done",
		color: "bg-sky-600",
		message: "Created",
	},
	failed: {
		icon: "ic-cloud-fail",
		color: "bg-orange-700",
		message: "Saving failed",
	},
};

export default function NoteStatus(props: INoteStatusProps) {
	return (
		<>
			{props.isLoggedIn ? (
				props.status && (
					<div
						className={
							"flex place-items-center gap-1.5 fixed bottom-0 right-0 shadow rounded-md px-2" +
							" py-1 font-medium text-sm text-white z-30 m-6 " +
							props.status.color
						}
					>
						{props.status.message === NOTE_STATUS.saving.message ? (
							<Spinner color="white" size="xs" />
						) : (
							<span className={"ic ic-white align-middle " + props.status.icon}></span>
						)}
						<span>{props.status.message}</span>
					</div>
				)
			) : (
				<div className="fixed bottom-0 right-0 bg-red-900 shadow rounded-md px-2 py-1 font-medium text-sm text-white z-30 m-6">
					<span className="ic align-middle ic-cloud-fail"></span>
					&nbsp; Sign-in to auto-save
				</div>
			)}
		</>
	);
}
