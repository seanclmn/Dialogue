import type { Meta, StoryObj } from "@storybook/react";
import { Message } from "./Message";

const meta: Meta<typeof Message> = {
  component: Message,
  title: "Shared/Message",
  argTypes: {
    senderIsMe: { control: "boolean" },
    first: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof Message>;

export const FromMe: Story = {
  args: {
    id: "1",
    text: "Hello from me!",
    date: "2024-01-15 14:30",
    senderIsMe: true,
    first: false,
  },
};

export const FromOther: Story = {
  args: {
    id: "2",
    text: "Hi there! How are you?",
    date: "2024-01-15 14:31",
    senderIsMe: false,
    first: true,
  },
};

export const LongMessage: Story = {
  args: {
    id: "3",
    text: "This is a longer message to show how the component handles wrapping. It might span multiple lines in the chat bubble.",
    date: "2024-01-15 14:32",
    senderIsMe: false,
    first: false,
  },
};
