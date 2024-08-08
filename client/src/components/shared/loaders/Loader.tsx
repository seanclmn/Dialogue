interface LoaderProps {
  styles?: string;
}

export const Loader = ({ styles }: LoaderProps) => {
  return (
    <div
      className={`inline-block h-6 w-6
				animate-spin rounded-full border-[1px]
				border-solid border-gray-400 border-current border-e-transparent 
				align-[-0.125em] text-surface 
				motion-reduce:animate-[spin_linear_infinite] 
				dark:text-white ${styles}`}
      style={{ animationDuration: "0.5s" }}
      role="status"
    ></div>
  );
};
