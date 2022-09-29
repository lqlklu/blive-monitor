import { fileURLToPath, URL } from "node:url";
import { builtinModules } from "module";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  root: __dirname,
  base: "./",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "../../dist/renderer",
    assetsDir: "",
    rollupOptions: {
      output: {
        format: "cjs",
      },
      external: ["electron", ...builtinModules],
    },
  },
  optimizeDeps: {
    exclude: ["electron"],
  },
});
