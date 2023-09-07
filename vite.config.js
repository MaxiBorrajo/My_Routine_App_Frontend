import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import sass from "sass";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "MyRoutineApp",
        short_name: "MyRoutine",
        description:
          "MyRoutineApp: tu app de ejercicios personalizados. Registra rutinas y crea ejercicios con series, peso y descanso. Sube fotos, ve tu progreso y mejora día a día. ¡Mejora tu bienestar con MyRoutine!",
        theme_color: "#1a1919",
        background_color: "#ffffff",
        start_url: "/",
        display: "standalone",
        icons: [
          {
            src: "./public/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./public/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
        additionalData: `
      @import "@/scss/_variables.scss";
      `,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/v1": "https://my-routine-app-backend.vercel.app",
    },
  },
});
