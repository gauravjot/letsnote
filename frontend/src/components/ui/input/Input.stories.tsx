// InputField.stories.ts|tsx

import type {Meta, StoryObj} from "@storybook/react";
import InputField from "./Input";

const meta: Meta<typeof InputField> = {
	component: InputField,
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Storybook: Story = {
	argTypes: {
		elementIsTextarea: {
			options: [true, false],
			control: {type: "radio"},
		},
		elementWidth: {
			options: ["auto", "full"],
			control: {type: "radio"},
		},
		elementInputType: {
			options: ["text", "number", "password", "email"],
			control: {type: "radio"},
		},
	},
	args: {
		elementId: "Input",
		elementLabel: "Input",
		elementInputType: "text",
	},
	render: ({...args}) => <InputField {...args} />,
};
