import type { Meta, StoryObj } from "@storybook/react";
import { Message } from "./Message";
import { UserContext } from "@contexts/UserContext";

const meta: Meta<typeof Message> = {
  component: Message,
  title: "Shared/Message",
  decorators: [
    (Story) => (
      <UserContext.Provider
        value={{
          user: { id: "me", username: "me", bio: null, avatarUrl: null, chatIds: [] },
          setUser: () => {},
          currentUserRef: null,
          setCurrentUserRef: () => {},
        }}
      >
        <Story />
      </UserContext.Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Message>;

const baseProps = {
  id: "1",
  date: "2024-01-15 14:30",
};

export const FromMe: Story = {
  args: {
    ...baseProps,
    text: "Hello from me!",
    userId: "me",
    previousMessageUserId: "me",
    nextMessageUserId: "other",
  },
};

export const FromOther: Story = {
  args: {
    ...baseProps,
    text: "Hi there! How are you?",
    userId: "other",
    previousMessageUserId: "me",
    nextMessageUserId: "other",
  },
};

export const LongMessage: Story = {
  args: {
    ...baseProps,
    text: "This is a longer message to show how the component handles wrapping. It might span multiple lines in the chat bubble.",
    userId: "other",
    previousMessageUserId: "other",
    nextMessageUserId: "other",
  },
};

export const WithGif: Story = {
  args: {
    ...baseProps,
    text: "",
    gifUrl: "https://media.giphy.com/media/3o7TKsQ82J2q7bFpSo/giphy.gif",
    userId: "me",
    previousMessageUserId: "other",
    nextMessageUserId: "me",
  },
};

export const StartOfConversation: Story = {
  args: {
    ...baseProps,
    text: "First message after a long pause",
    userId: "other",
    previousMessageUserId: "other",
    nextMessageUserId: "other",
    previousMessageDate: "2024-01-15 12:00",
  },
};

export const HoverToReply: Story = {
  args: {
    ...baseProps,
    text: "Hover over me to see the reply button",
    userId: "other",
    previousMessageUserId: "other",
    nextMessageUserId: "other",
    onReply: () => alert("Reply clicked"),
  },
};

export const Reply: Story = {
  args: {
    ...baseProps,
    text: "Sounds good, see you then!",
    userId: "me",
    previousMessageUserId: "other",
    nextMessageUserId: "me",
    parentMessageId: "0",
    parentMessageText: "Are we still meeting at 5pm today?",
    parentMessageUsername: "other",
    onReply: () => alert("Reply clicked"),
  },
};

export const WithReactions: Story = {
  args: {
    ...baseProps,
    text: "Check out this cool feature!",
    userId: "other",
    previousMessageUserId: "other",
    nextMessageUserId: "other",
    reactions: [
      { id: "r1", emoji: "👍", userId: "me", username: "me", avatarUrl: null },
      { id: "r2", emoji: "👍", userId: "other2", username: "other2", avatarUrl: null },
      { id: "r3", emoji: "❤️", userId: "other3", username: "other3", avatarUrl: null },
    ],
    onToggleReaction: (emoji, isRemoving) =>
      alert(`${isRemoving ? "Remove" : "Add"} ${emoji} reaction`),
  },
};

export const HoverToReact: Story = {
  args: {
    ...baseProps,
    text: "Hover over me to see the react button",
    userId: "other",
    previousMessageUserId: "other",
    nextMessageUserId: "other",
    onToggleReaction: (emoji, isRemoving) =>
      alert(`${isRemoving ? "Remove" : "Add"} ${emoji} reaction`),
  },
};
