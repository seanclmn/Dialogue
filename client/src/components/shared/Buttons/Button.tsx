import { Loader } from "../loaders/Loader";

export interface ButtonProps extends React.DOMAttributes<HTMLButtonElement> {
  styles?: string;
  loading?: boolean;
  disabled?: boolean;
}

export const Button = ({
  styles,
  loading,
  disabled,
  onClick,
  children,
}: ButtonProps) => {
  return (
    <button
      className={`bg-blue-400 text-white w-auto px-2
			py-2 rounded-md border-blue-400 border-[1px] border-solid flex items-center justify-center
      disabled:opacity-70 disabled:cursor-not-allowed
      ${styles}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <Loader color="gray-100" width={2} height={6} radius={8} styles="animate-spin" /> : children}
    </button>
  );
};
