import * as React from "react";
import {Link} from "react-router-dom";
import LoginRegister from "./LoginRegister";
import SidebarUserSkeleton from "@/components/skeleton/SidebarUserSkeleton";

export interface ISidebarProps {
	component: React.ReactNode;
}

export default function Sidebar(props: ISidebarProps) {
	return (
		<div className="h-screen max-h-screen overflow-y-auto min-w-0 w-full bg-white block border-r border-gray-300 border-solid sticky top-0">
			<div className="p-5 border-b bg-white border-gray-300 shadow-smb sticky top-0 z-30">
				<Link to={"/"}>
					<span className="font-sans font-black tracking-tighter text-black underline-offset-2 duration-200 transition-all hover:underline hover:underline-offset-4 text-[1.75rem] py-0.5">
						letsnote.io
					</span>
				</Link>
			</div>
			<React.Suspense fallback={<SidebarUserSkeleton />}>
				<LoginRegister />
			</React.Suspense>
			{props.component}
		</div>
	);
}
