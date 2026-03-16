import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Shared/Button",
  argTypes: {
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    onClick: { action: "clicked" },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    title: "Click me",
  },
};

export const Loading: Story = {
  args: {
    title: "Saving...",
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    title: "Disabled",
    disabled: true,
  },
};

export const WithCustomStyles: Story = {
  args: {
    title: "Custom style",
    styles: "bg-primary text-my-txt-color px-4",
  },
};

export const Submit: Story = {
  args: {
    title: "Submit",
  },
};
