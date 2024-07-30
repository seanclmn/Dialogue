import React, { useEffect, useRef, useState } from "react";

interface ChatInputProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {}

export const ChatInput = ({ onChange, value }: ChatInputProps) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [value, windowWidth]);
  return (
    <textarea
      className=" w-[100%] mx-0 resize-none leading-none 
        transition-all duration-1000 ease-in-out outline-none"
      rows={1}
      ref={textAreaRef}
      onChange={onChange}
      value={value}
    />
  );
};
