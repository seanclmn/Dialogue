const PROD_API_DEFAULT =
  "https://dialogue-api-1043694315311.us-east4.run.app";
const DEV_API_DEFAULT = "http://localhost:8080";

/** Origin of the Nest API (GraphQL + REST). Must match Relay HTTP endpoint host. */
export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN?.toString().trim() ||
  (import.meta.env.PROD ? PROD_API_DEFAULT : DEV_API_DEFAULT);

/** Vite mode: `development` while running `vite`, `production` after `vite build`. */
export const IS_DEV = import.meta.env.DEV;
