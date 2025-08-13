import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // @ -> src 경로로 매핑
    },
  },
  server: {
    host: true,
    // proxy: {
    //   // 프론트에서 호출하는 /api → 백엔드로 프록시
    //   "/api": {
    //     target: "http://3.35.50.61:8080",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
});
