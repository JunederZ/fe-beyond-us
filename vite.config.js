// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  assetsInclude: ["./fonts/**", "./images/*", "./data/**"],
  resolve: {
    alias: {
      $fonts: resolve('./fonts'),
      $images: resolve('./images/'),
      $: resolve('./'),
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        cockpit: resolve(__dirname, "pages/cockpit.html"),
        mission: resolve(__dirname, "pages/mission.html"),
        planet: resolve(__dirname, "pages/planet.html"),
        gasplanet: resolve(__dirname, "pages/planet.html"),
        loworbit: resolve(__dirname, "pages/loworbit.html"),
        orbit: resolve(__dirname, "pages/orbit.html"),
        system: resolve(__dirname, "pages/system.html"),
        rplanet: resolve(__dirname, "pages/rplanet.html"),
      },
    },
  },
});
