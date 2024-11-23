import { Loader } from "../loaders/Loader";


export interface ButtonProps extends React.DOMAttributes<HTMLButtonElement> {
  styles?: string;
  title: string;
  type?: "submit" | "reset" | "button";
  loading?: boolean;
  disabled?: boolean;
}

export const Button = ({ styles, type, title, loading, disabled, onClick }: ButtonProps) => {
  return (
    <button
      type={type}
      className={`bg-blue-400 text-white w-full px-2
			py-2 rounded-md border-blue-400 border-[1px] border-solid ${styles}`}
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? <Loader styles="border-white h-4 w-4" /> : title}
    </button>
  );
};
