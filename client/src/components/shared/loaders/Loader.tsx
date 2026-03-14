interface LoaderProps {
  styles?: string;
  color?: string;
  width?: number;
  height?: number;
  radius?: number;
}

export const Loader = ({ styles = "", color = "primary", width = 2, height = 8, radius = 10 }: LoaderProps) => {
  return (
    <div
      className={`relative inline-block animate-spin w-${width} h-${height} ${styles}`}
      style={{ animationDuration: "1.5s" }}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * 360;
        return (
          <div
            key={i}
            className={`absolute left-1/2 top-1/2 rounded-full opacity-80 bg-${color}`}
            style={{
              width: width ?? 2,
              height: height ?? 8,
              marginLeft: -(width ?? 2) / 2,
              marginTop: -(height ?? 8) / 2,
              transform: `rotate(${angle}deg) translateY(-${radius ?? 10}px)`,
              transformOrigin: "center center",
            }}
          />
        );
      })}
    </div>
  );
};
