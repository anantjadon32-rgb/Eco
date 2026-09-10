import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    open: true
  },

  build: {
    rollupOptions: {
      input: {
        main: new URL("./index.html", import.meta.url).pathname,
        dashboard: new URL("./dashboard/index.html", import.meta.url).pathname,
        ai: new URL("./ai/index.html", import.meta.url).pathname
      }
    }
  }
});
