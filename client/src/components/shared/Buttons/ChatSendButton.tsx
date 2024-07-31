interface ChatSendButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  styles?: string;
}

export const ChatSendButton = ({ styles, disabled }: ChatSendButtonProps) => {
  return (
    <button
      type="submit"
      className={`top-0 ${disabled && "text-gray-400"} ${styles}`}
      disabled={disabled}
    >
      Send
    </button>
  );
};
