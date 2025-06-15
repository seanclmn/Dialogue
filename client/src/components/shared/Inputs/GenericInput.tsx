export interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  title: string;
  styles?: string;
}

export const Input = ({ styles, title, onChange }: InputProps) => {
  return (
    <>
      <input
        type="text"
        placeholder={title}
        id={title}
        onChange={onChange}
        className={`border-[1px] rounded-md px-2
			py-2 border-black border-solid w-full ${styles}`}
      />
    </>
  );
};
