import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import terser from "@rollup/plugin-terser";

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
        },
      },
    },
  },
});
