import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import sass from "sass";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        name: "MyRoutineApp",
        short_name: "MyRoutineApp",
        display: "standalone",
        background_color: "#1a1919",
        description: "MyRoutineApp: tu app de ejercicios personalizados. Registra rutinas y crea ejercicios con series, peso y descanso. Sube fotos, ve tu progreso y mejora día a día. ¡Mejora tu bienestar con MyRoutine!",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.pathname.startsWith("/v1");
            },
            handler: "CacheFirst",
            options: {
              cacheName: "api-cache",
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
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
