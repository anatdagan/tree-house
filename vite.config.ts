import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import terser from "@rollup/plugin-terser";
import path from "path";
const isProduction = process.env.NODE_ENV === "production";

const profiling = isProduction && {
  "react-dom/client": "react-dom/profiling",
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    terser({
      format: {
        comments: false,
      },

      mangle: {
        keep_classnames: false,
        reserved: [],
      },
    }),
  ],
  server: {
    headers: {
      "cache-control": "max-age=31536000",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.js"],
  },
  build: {
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react"],
          "react-dom": ["react-dom"],
          lodash: ["lodash"],
          firebase: ["firebase/app"],
          // "firebase-auth": ["firebase/auth"],
          "firebase-firestore": ["firebase/firestore"],
          "firebase-storage": ["firebase/storage"],
          // "firebase-app-check": ["firebase/app-check"],
          //"firebase-vertexai": ["firebase/vertexai-preview"],
        },
      },
    },
  },
  resolve: {
    alias: {
      ...profiling,
      "@": path.resolve(__dirname, "./src"),
      "/tests": path.resolve(__dirname, "./tests"),
    },
  },
});
