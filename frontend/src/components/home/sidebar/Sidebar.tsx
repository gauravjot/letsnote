import LoginSkeleton from "@/components/ui/skeleton/LoginSkeleton";
import {NoteType} from "@/types/api";
import {NoteListItemType} from "@/types/note";
import {Suspense, lazy} from "react";

// Lazy imports
const NoteList = lazy(() => import("@/components/home/sidebar/NoteList"));
const LoginRegister = lazy(() => import("@/components/home/sidebar/LoginRegister"));

interface ISidebarProps {
	currentNoteID: NoteType["id"] | null;
	openNote: (nid: NoteType["id"]) => void;
	openShareNote: (note: NoteListItemType) => void;
}

export default function HomeSidebar(props: ISidebarProps) {
	const notesSkeleton = (
		<div className="my-3 py-4 px-4 border-b border-gray-300 shadow-smb animate-pulse">
			<div className="h-6 bg-gray-200 w-28 rounded my-2"></div>
			<div className="flex gap-4 place-items-center my-8">
				<div className="flex flex-1 gap-3 flex-col">
					<div className="h-4 bg-gray-200 rounded"></div>
					<div className="h-4 bg-gray-200 rounded w-1/2"></div>
				</div>
				<div>
					<div className="size-8 rounded-full bg-gray-200"></div>
				</div>
			</div>
			<div className="flex gap-4 place-items-center my-8">
				<div className="flex flex-1 gap-3 flex-col">
					<div className="h-4 bg-gray-200 rounded"></div>
					<div className="h-4 bg-gray-200 rounded w-1/2"></div>
				</div>
				<div>
					<div className="size-8 rounded-full bg-gray-200"></div>
				</div>
			</div>
			<div className="flex gap-4 place-items-center my-8">
				<div className="flex flex-1 gap-3 flex-col">
					<div className="h-4 bg-gray-200 rounded"></div>
					<div className="h-4 bg-gray-200 rounded w-1/2"></div>
				</div>
				<div>
					<div className="size-8 rounded-full bg-gray-200"></div>
				</div>
			</div>
		</div>
	);

	return (
		<>
			<Suspense fallback={<LoginSkeleton />}>
				<LoginRegister />
			</Suspense>
			<Suspense fallback={notesSkeleton}>
				<NoteList
					openNote={props.openNote}
					shareNote={props.openShareNote}
					currentNote={props.currentNoteID !== undefined ? props.currentNoteID : null}
				/>
			</Suspense>
		</>
	);
}
