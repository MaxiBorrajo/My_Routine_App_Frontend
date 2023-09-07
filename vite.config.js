import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import sass from "sass";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "MyRoutineApp",
        short_name: "MyRoutine",
        description:
          "MyRoutineApp: tu app de ejercicios personalizados. Registra rutinas y crea ejercicios con series, peso y descanso. Sube fotos, ve tu progreso y mejora día a día. ¡Mejora tu bienestar con MyRoutine!",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#1a1919",
        icons: [
          {
            src: "src/assets/logo_192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "src/assets/logo_512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "src/assets/logo_512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "src/assets/logo_512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
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
