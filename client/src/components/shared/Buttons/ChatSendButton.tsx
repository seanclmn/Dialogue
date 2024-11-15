interface ChatSendButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  styles?: string;
  onClick: () => void;
}

export const ChatSendButton = ({ styles, disabled, onClick }: ChatSendButtonProps) => {
  return (
    <button
      type="submit"
      className={`top-0 ${disabled && "text-gray-400"} ${styles}`}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
    >
      Send
    </button>
  );
};
