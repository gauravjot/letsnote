// Button.stories.ts|tsx

import type {Meta, StoryObj} from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
	component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Storybook: Story = {
	argTypes: {
		elementStyle: {
			options: ["primary", "black", "danger", "white_no_border", "white_border"],
			control: {type: "select"},
		},
		elementChildren: {
			description: "Button",
			control: {type: "text"},
		},
		elementState: {
			control: {type: "select"},
		},
		elementSize: {
			control: {type: "select"},
		},
		elementIcon: {
			options: ["add", "close"],
			control: {type: "select"},
		},
	},
	args: {
		elementSize: "base",
		elementStyle: "primary",
		elementChildren: "Add Item",
		elementIcon: "add",
		elementState: "default",
		elementInvert: false,
		elementDisabled: false,
		elementWidth: "auto",
		elementType: "button",
	},
	render: ({...args}) => <Button {...args} />,
};
