import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.js"],
  },
  server: {
    proxy: {
      // Proxying websockets or socket.io
      "/socket.io": {
        target: "ws://localhost:4000",
        ws: true,
      },
    },
  },
});
