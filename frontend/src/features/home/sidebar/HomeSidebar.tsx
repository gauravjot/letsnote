import SideBarNotelistSkeleton from "@/components/skeleton/SidebarNotelistSkeleton";
import {NoteType} from "@/types/api";
import {NoteListItemType} from "@/types/note";
import {Suspense, lazy} from "react";

// Lazy imports
const NoteList = lazy(() => import("@/features/home/sidebar/NoteList"));

interface ISidebarProps {
	currentNoteID: NoteType["id"] | null;
	openNote: (nid: NoteType["id"] | null) => void;
	openShareNote: (note: NoteListItemType) => void;
}

export default function HomeSidebar(props: ISidebarProps) {
	return (
		<>
			<Suspense fallback={<SideBarNotelistSkeleton />}>
				<NoteList
					openNote={props.openNote}
					shareNote={props.openShareNote}
					currentNote={props.currentNoteID !== undefined ? props.currentNoteID : null}
				/>
			</Suspense>
		</>
	);
}
