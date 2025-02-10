import { HTMLAttributes } from "react";

interface TextButtonProps extends HTMLAttributes<HTMLDivElement> {
  text: string;
}

export const TextButton = ({ text, className, ...rest }: TextButtonProps) => {
  return (
    <p
      className={"cursor-pointer hover:underline text-sm " + className}
      {...rest}
    >
      {text}
    </p>
  );
};
