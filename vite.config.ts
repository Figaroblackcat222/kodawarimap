import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "path";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: "autoUpdate",
    includeAssets: ["favicon.ico", "apple-touch-icon.png"],
    manifest: {
      name: "kodawarimap",
      short_name: "kodawarimap",
      description: "自分のこだわりを地図に刻み、資産化するローカルファースト型趣味記録PWA",
      theme_color: "#1a1a2e",
      background_color: "#ffffff",
      display: "standalone",
      orientation: "portrait",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      // PMTiles へのレンジリクエストはService Workerの通常キャッシュ対象外
      // タイルキャッシュは infrastructure/cache/ で独自実装
      globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    },
  }), cloudflare()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          maplibre: ["maplibre-gl"],
          heic: ["heic-to"],
          vendor: ["react", "react-dom", "dexie", "exifr"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@domain": resolve(__dirname, "src/domain"),
      "@application": resolve(__dirname, "src/application"),
      "@infrastructure": resolve(__dirname, "src/infrastructure"),
      "@presentation": resolve(__dirname, "src/presentation"),
    },
  },
});