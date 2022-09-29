import { builtinModules } from "module";
import { defineConfig } from "vite";

export default defineConfig({
  root: __dirname,
  build: {
    outDir: "../../dist/main",
    lib: {
      entry: "src/index.ts",
      formats: ["cjs"],
      fileName: () => "[name].js",
    },
    rollupOptions: {
      external: ["electron", ...builtinModules],
    },
  },
});
