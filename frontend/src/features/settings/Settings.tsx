import {useEffect} from "react";
import Button from "@/components/ui/button/Button";
import AccountSettings from "./AccountSettings";
import SecuritySettings from "./SecuritySettings";

export function Settings({closeFn}: {closeFn: () => void}) {
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
		<div className="fixed inset-0 flex place-items-center justify-center z-[60]">
			<div className="bg-black/30 absolute inset-0 z-10 backdrop-blur-[2px]"></div>
			<div className="bg-white overflow-hidden rounded-lg shadow relative z-20 w-[95vw] md:w-[70vw] max-w-[60rem]">
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
				<div className="md:grid md:grid-cols-4 md:gap-4">
					{/** left sidebar */}
					<div className="hidden md:block col-span-1 border-r px-4">
						<ul className="my-8">
							<li>
								<a
									href="#account-settings"
									className="group px-3 text-gray-500 text-bb font-medium py-0.5 hover:bg-gray-100 hover:text-black my-1 flex rounded-md place-items-center gap-2"
								>
									<span className="ic ic-account-settings opacity-60 group-hover:opacity-100"></span>
									<span>Account</span>
								</a>
							</li>
							<li>
								<a
									href="#security-settings"
									className="group px-3 text-gray-500 text-bb font-medium py-0.5 hover:bg-gray-100 hover:text-black my-1 flex rounded-md place-items-center gap-2"
								>
									<span className="ic ic-security-settings opacity-60 group-hover:opacity-100"></span>
									<span>Security</span>
								</a>
							</li>
						</ul>
					</div>
					{/** main content */}
					<div className="col-span-3 h-[95vh] md:h-[80vh] md:max-h-[45rem] overflow-auto px-4 relative">
						<AccountSettings />

						<SecuritySettings />
					</div>
				</div>
			</div>
		</div>
	);
}
