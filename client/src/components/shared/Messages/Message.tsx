export interface MessageProps extends React.DOMAttributes<HTMLElement> {
  text: string;
  id: string;
  senderIsMe?: boolean;
}

export const Message = ({ text, senderIsMe }: MessageProps) => {
  return (
    <div
      className={`${
        senderIsMe ? "bg-purple-700 ml-auto max-w-40" : "bg-gray-200"
      } my-[1px] p-1 rounded-[10px] inline-flex`}
    >
      <p
        lang="en"
        className={`px-2 whitespace-break-spaces break-words	
          text-[15px] hyphens-auto	 ${senderIsMe ? "text-white" : ""}`}
      >
        {text}
      </p>
    </div>
  );
};
