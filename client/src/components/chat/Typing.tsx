import { ReactElement } from "react";

export const Typing = (): ReactElement => {
  return (
    <div className="flex px-2 py-3 bg-gray-200 rounded-[10px]">
      <div className="mx-[1px] h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="mx-[1px] h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="mx-[1px] h-2 w-2 bg-black rounded-full animate-bounce"></div>
    </div>
  );
};
