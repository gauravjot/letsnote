import type {Preview} from "@storybook/react";
import "../src/assets/css/global.css";
import "../src/assets/css/icons.css";

const preview: Preview = {
	parameters: {
		actions: {argTypesRegex: "^on[A-Z].*"},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
};

export default preview;
