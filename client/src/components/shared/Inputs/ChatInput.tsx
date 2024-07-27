import React from "react";

interface ChatInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const ChatInput = ({ onChange, value }: ChatInputProps) => {
  return <input type="text" onChange={onChange} value={value} />;
};
