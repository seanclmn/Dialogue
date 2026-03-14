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
          user: { id: "me", username: "me", bio: null, chatIds: [] },
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
    props: {
      ...baseProps,
      text: "Hello from me!",
      userId: "me",
      previousMessageUserId: "me",
      nextMessageUserId: "other",
    },
  },
};

export const FromOther: Story = {
  args: {
    props: {
      ...baseProps,
      text: "Hi there! How are you?",
      userId: "other",
      previousMessageUserId: "me",
      nextMessageUserId: "other",
    },
  },
};

export const LongMessage: Story = {
  args: {
    props: {
      ...baseProps,
      text: "This is a longer message to show how the component handles wrapping. It might span multiple lines in the chat bubble.",
      userId: "other",
      previousMessageUserId: "other",
      nextMessageUserId: "other",
    },
  },
};

export const WithGif: Story = {
  args: {
    props: {
      ...baseProps,
      text: "",
      gifUrl: "https://media.giphy.com/media/3o7TKsQ82J2q7bFpSo/giphy.gif",
      userId: "me",
      previousMessageUserId: "other",
      nextMessageUserId: "me",
    },
  },
};

export const StartOfConversation: Story = {
  args: {
    props: {
      ...baseProps,
      text: "First message after a long pause",
      userId: "other",
      previousMessageUserId: "other",
      nextMessageUserId: "other",
      previousMessageDate: "2024-01-15 12:00",
    },
  },
};
