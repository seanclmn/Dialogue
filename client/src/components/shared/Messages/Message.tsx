export interface MessageProps extends React.DOMAttributes<HTMLElement> {
  text: string;
  id: string;
}

export const Message = ({ text }: MessageProps) => {
  return <p>{text}</p>;
};
