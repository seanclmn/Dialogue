export interface ButtonProps extends React.DOMAttributes<HTMLButtonElement> {
  styles?: string;
  title: string;
  type?: "submit" | "reset" | "button";
}

export const Button = ({ styles, type, title, onClick }: ButtonProps) => {
  return (
    <button
      type={type}
      className={`bg-blue-400 text-white w-full px-2
			py-[2px] rounded-md border-blue-400 border-[1px] border-solid ${styles}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};
