import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Import path to manage paths

export default defineConfig({
  plugins: [react()],
  //
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // "src" تعريف "@" كاختصار لمسار
    },
  },
  // Convert the backend server from http://localhost:8800 to http://localhost:5173
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8800", // Full URL for backend server
        changeOrigin: true, // Adjust the origin of the host header to the target URL
        secure: false, // Disable SSL verification (if using HTTPS in dev)
        rewrite: (path) => path, // Keep "/api" prefix in the path
      },
    },
  },
});
