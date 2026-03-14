import { memo } from "react";

export type MessageMediaType = "gif";

export interface MessageMediaProps {
  type: MessageMediaType;
  url: string;
  styles?: string;
}

const MEDIA_CONFIG = {
  gif: {
    maxWidth: "280px",
    maxHeight: "240px",
    alt: "GIF",
    label: "GIF",
  },
} 

export const MessageMedia = memo(({ type, url, styles}: MessageMediaProps) => {
  const config = MEDIA_CONFIG[type];
  if (!config) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block max-w-[280px] my-1 ${styles}`}
    >
      <img
        src={url}
        alt={config.alt}
        className="max-h-[240px] w-auto object-contain rounded-lg"
        loading="lazy"
      />
    </a>
  );
});
