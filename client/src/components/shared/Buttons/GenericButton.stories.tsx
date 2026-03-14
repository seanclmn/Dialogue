import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./GenericButton";

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Shared/GenericButton",
  argTypes: {
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
    },
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
    type: "button",
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
    type: "submit",
  },
};
