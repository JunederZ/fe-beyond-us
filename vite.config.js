// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      $fonts: resolve('./fonts'),
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        cockpit: resolve(__dirname, "pages/cockpit.html"),
        mission: resolve(__dirname, "pages/mission.html"),
        planet: resolve(__dirname, "pages/planet.html"),
        orbit: resolve(__dirname, "pages/orbit.html"),
        system: resolve(__dirname, "pages/system.html"),
      },
    },
  },
});
