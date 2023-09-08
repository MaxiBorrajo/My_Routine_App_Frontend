import { fileURLToPath, URL } from "node:url";
 
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import sass from "sass";

export default defineConfig({
  plugins: [vue()],
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
