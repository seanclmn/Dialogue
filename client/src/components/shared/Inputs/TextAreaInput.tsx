export interface TextAreaInputProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  title: string;
  styles?: string;
}

export const TextAreaInput = ({ styles, title, onChange, ...props }: TextAreaInputProps) => {
  return (
    <>
      <textarea
        placeholder={title}
        id={title}
        onChange={onChange}
        className={`border-[1px] rounded-md px-2 py-2 border-brd-color border-solid w-full bg-bgd-color text-txt-color ${styles}`}
        {...props}
      />
    </>
  );
} 