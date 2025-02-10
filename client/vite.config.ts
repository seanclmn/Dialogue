import relay from "vite-plugin-relay";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
//@ts-ignore
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [relay, react()],
  base: "./",
  resolve: {
    alias: {
      //@ts-ignore
      "@components": path.resolve(__dirname, "src/components/"),
      //@ts-ignore
      "@hooks": path.resolve(__dirname, "src/hooks/"),
      //@ts-ignore
      "@pages": path.resolve(__dirname, "src/pages/"),
      //@ts-ignore
      "@generated/*": path.resolve(__dirname, "./__generated__/*"),
      //@ts-ignore
      "@contexts": path.resolve(__dirname, "src/contexts/"),
      //@ts-ignore
      "@assets/*": path.resolve(__dirname, "src/assets/"),
    },
  },
});
