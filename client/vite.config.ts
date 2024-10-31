import relay from "vite-plugin-relay";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [relay, react()],
  base: "./",
  resolve: {
    alias: {
      '@components/*': './src/components/*',
      "@generated/*": "./__generated__/*"
    }
  }
});
