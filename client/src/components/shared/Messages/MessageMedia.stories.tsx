import type { Meta, StoryObj } from "@storybook/react";
import { MessageMedia } from "./MessageMedia";

const meta: Meta<typeof MessageMedia> = {
  component: MessageMedia,
  title: "Shared/MessageMedia",
};

export default meta;

type Story = StoryObj<typeof MessageMedia>;

export const Gif: Story = {
  args: {
    type: "gif",
    url: "https://media.giphy.com/media/3o7TKsQ82J2q7bFpSo/giphy.gif",
  },
};
