import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [vue()],
  build: {
    outDir: "./dist/renderer",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src/renderer/", import.meta.url)),
    },
  },
});
