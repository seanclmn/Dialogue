import relay from "vite-plugin-relay";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
//@ts-ignore
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [relay, react()],
  base: "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router", "@headlessui/react", "@heroicons/react/24/outline", "@heroicons/react/16/solid"],
          "relay-vendor": ["relay-runtime", "react-relay"],
        },
      },
    },
  },
  resolve: {
    alias: {
      //@ts-ignore
      "@components": path.resolve(__dirname, "src/components/"),
      //@ts-ignore
      "@mutations": path.resolve(__dirname, "src/mutations/"),
      //@ts-ignore
      "@pages": path.resolve(__dirname, "src/pages/"),
      //@ts-ignore
      "@generated/*": path.resolve(__dirname, "./__generated__/*"),
      //@ts-ignore
      "@contexts": path.resolve(__dirname, "src/contexts/"),
      //@ts-ignore
      "@utils": path.resolve(__dirname, "src/utils/"),
      //@ts-ignore
      "@assets/*": path.resolve(__dirname, "src/assets/"),
    },
  },
});
