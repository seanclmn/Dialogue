import { memo } from "react";

export type MessageMediaType = "gif";

const MAX_GIF_WIDTH = 280;
const MAX_GIF_HEIGHT = 240;

export interface MessageMediaProps {
  type: MessageMediaType;
  url: string;
  width?: number | null;
  height?: number | null;
  styles?: string;
}

const MEDIA_CONFIG = {
  gif: {
    maxWidth: MAX_GIF_WIDTH,
    maxHeight: MAX_GIF_HEIGHT,
    alt: "GIF",
    label: "GIF",
  },
};

function clampDimensions(
  width: number | undefined,
  height: number | undefined,
): { width: number; height: number } | null {
  if (width == null || height == null || width <= 0 || height <= 0) return null;
  const scale = Math.min(MAX_GIF_WIDTH / width, MAX_GIF_HEIGHT / height, 1);
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

export const MessageMedia = memo(({ type, url, width, height, styles }: MessageMediaProps) => {
  const config = MEDIA_CONFIG[type];
  if (!config) return null;

  const placeholder = clampDimensions(width ?? undefined, height ?? undefined);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block max-w-[280px] my-1 ${styles}`}
      style={
        placeholder
          ? { minWidth: placeholder.width, minHeight: placeholder.height }
          : undefined
      }
    >
      <img
        src={url}
        alt={config.alt}
        width={placeholder?.width}
        height={placeholder?.height}
        className="max-h-[240px] w-auto max-w-[280px] object-contain rounded-lg"
        // loading="lazy"
      />
    </a>
  );
});
