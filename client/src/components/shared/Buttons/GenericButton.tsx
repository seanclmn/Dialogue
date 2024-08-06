export interface ButtonProps {
  styles?: string;
  title: string;
  type?: "submit" | "reset" | "button";
}

export const Button = ({ styles, type, title }: ButtonProps) => {
  return (
    <button
      type={type}
      className={`bg-blue-400 text-white w-full px-2
			py-[2px] rounded-md border-blue-400 border-[1px] border-solid ${styles}`}
    >
      {title}
    </button>
  );
};
