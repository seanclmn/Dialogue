/** Origin of the Nest API (GraphQL + REST). Must match Relay HTTP endpoint host. */
export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN?.toString() || "https://dialogue-api-1043694315311.us-east4.run.app";
