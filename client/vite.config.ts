import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8888,
    strictPort: true,
    hmr: {
  
    }
  },
  build: {
    outDir: "../server/public",
    emptyOutDir: true,
  },
  plugins: [vue()],
});
