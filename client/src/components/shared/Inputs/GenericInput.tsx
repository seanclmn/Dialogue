import { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  styles?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ styles, title, type = "text", ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        placeholder={title}
        id={title}
        className={`border-[1px] rounded-md px-2 py-2 border-brd-color border-solid w-full bg-bgd-color text-txt-color ${styles}`}
        {...rest}
      />
    );
  }
);

Input.displayName = "Input";
