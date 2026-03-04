import type { Meta, StoryObj } from "@storybook/react";
import { Loader } from "./Loader";

const meta: Meta<typeof Loader> = {
  component: Loader,
  title: "Shared/Loader",
};

export default meta;

type Story = StoryObj<typeof Loader>;

export const Default: Story = {};

export const WithCustomStyles: Story = {
  args: {
    styles: "border-2 border-primary h-8 w-8",
  },
};
