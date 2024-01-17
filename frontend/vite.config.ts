import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

export default defineConfig({
	// depending on your application, base can also be "/"
	base: "/",
	plugins: [react(), viteTsconfigPaths(), svgr({svgrOptions: {icon: true}})],
});
