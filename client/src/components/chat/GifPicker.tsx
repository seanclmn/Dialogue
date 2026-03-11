import { useCallback, useEffect, useState } from "react";
import { Loader } from "@components/shared/loaders/Loader";

const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY ?? "";
const GIPHY_SEARCH_URL = "https://api.giphy.com/v1/gifs/search";

type GiphyImage = { url: string };
type GiphyGif = {
  id: string;
  title: string;
  images: {
    fixed_height?: GiphyImage;
    fixed_height_small?: GiphyImage;
    downsized_medium?: GiphyImage;
    downsized?: GiphyImage;
    original?: GiphyImage;
  };
};

type GiphyResponse = {
  data: GiphyGif[];
};

function searchGifs(query: string, signal?: AbortSignal): Promise<GiphyGif[]> {
  if (!GIPHY_API_KEY) return Promise.resolve([]);
  const params = new URLSearchParams({
    api_key: GIPHY_API_KEY,
    q: query.trim(),
    limit: "20",
    rating: "g",
    lang: "en",
  });
  return fetch(`${GIPHY_SEARCH_URL}?${params}`, { signal })
    .then((res) => res.json() as Promise<GiphyResponse>)
    .then((json) => json.data ?? [])
    .catch(() => []);
}

export interface GifPickerProps {
  onSelect: (gifUrl: string) => void;
  onClose: () => void;
}

export function GifPicker({ onSelect, onClose }: GifPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GiphyGif[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchGifs(query, controller.signal)
        .then(setResults)
        .catch(() => setError("Search failed"))
        .finally(() => setLoading(false));
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSelect = useCallback(
    (gif: GiphyGif) => {
      const url =
        gif.images.downsized_medium?.url ??
        gif.images.downsized?.url ??
        gif.images.fixed_height?.url ??
        gif.images.original?.url;
      if (url) onSelect(url);
      onClose();
    },
    [onSelect, onClose],
  );

  if (!GIPHY_API_KEY) {
    return (
      <div className="p-4 bg-bgd-highlight rounded-lg border border-brd-color text-txt-color text-sm w-full">
        <p className="font-medium mb-1">GIF search</p>
        <p className="text-txt-color/80">
          Set <code className="bg-bgd-color px-1 rounded">VITE_GIPHY_API_KEY</code> in your env to
          enable. Get a key at{" "}
          <a
            href="https://developers.giphy.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            developers.giphy.com
          </a>
          .
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 px-2 py-1 rounded bg-bgd-color border border-brd-color"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-bgd-highlight rounded-lg border border-brd-color overflow-hidden max-h-[280px] w-full">
      <div className="p-2 border-b border-brd-color flex items-center gap-2 shrink-0">
        <input
          type="search"
          placeholder="Search GIFs..."
          className="flex-1 min-w-0 px-2 py-1.5 rounded border border-brd-color bg-bgd-color text-txt-color text-sm outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          autoComplete="off"
        />
        <button
          type="button"
          onClick={onClose}
          className="px-2 py-1 rounded text-txt-color hover:bg-bgd-color shrink-0"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <div className="overflow-auto p-2 flex-1">
        {error ? (
          <p className="text-sm text-txt-color/80">{error}</p>
        ) : loading && results.length === 0 ? (
          <div className="flex justify-center py-6">
            <Loader />
          </div>
        ) : results.length === 0 && query.trim() ? (
          <p className="text-sm text-txt-color/80 py-4 text-center">No GIFs found. Try another search.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
            {results.map((gif) => (
              <button
                type="button"
                key={gif.id}
                className="relative block w-full aspect-square rounded overflow-hidden hover:ring-2 ring-primary focus:ring-2 focus:ring-primary focus:outline-none"
                onClick={() => handleSelect(gif)}
                aria-label={gif.title || "Select GIF"}
              >
                <img
                  src={gif.images.fixed_height?.url ?? gif.images.fixed_height_small?.url ?? ""}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
