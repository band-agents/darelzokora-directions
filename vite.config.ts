import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { fileURLToPath } from "node:url";

/* `--mode single` inlines everything into one HTML file — the form the
   directions are published in, since the artifact host only serves scripts
   from a short CDN allowlist. The default build is a normal multi-file site
   for GitHub Pages or any static host. */
export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [react(), ...(mode === "single" ? [viteSingleFile()] : [])],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: {
    outDir: mode === "single" ? "dist-single" : "dist",
    assetsInlineLimit: mode === "single" ? 100_000_000 : 4096,
    chunkSizeWarningLimit: 2000,
  },
}));
