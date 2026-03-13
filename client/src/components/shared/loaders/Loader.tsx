interface LoaderProps {
  styles?: string;
}

export const Loader = ({ styles = "" }: LoaderProps) => {
  return (
    <div
      className={`inline-block h-8 w-8 rounded-full border-2 border-brd-color border-t-primary animate-spin ${styles}`}
      style={{ animationDuration: "0.8s" }}
      role="status"
      aria-label="Loading"
    />
  );
};
