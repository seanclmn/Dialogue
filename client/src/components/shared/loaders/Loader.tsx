interface LoaderProps {
  styles?: string;
}

export const Loader = ({ styles }: LoaderProps) => {
  return (
    <div
      className={`inline-block h-8 w-8 
				animate-spin rounded-full border-2 
				border-solid border-current border-e-transparent 
				align-[-0.125em] text-surface 
				motion-reduce:animate-[spin_500ms_linear_infinite] 
				dark:text-white ${styles}`}
      role="status"
    ></div>
  );
};
