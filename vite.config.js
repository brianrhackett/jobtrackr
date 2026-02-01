import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    laravel({
      input: [
        "resources/css/app.css",
        "resources/js/app.jsx", // 👈 IMPORTANT
      ],
      refresh: true,
    }),
    react(), // 👈 THIS FIXES JSX + React errors
    tailwindcss(),
  ],
  server: {
    watch: {
      ignored: ["**/storage/framework/views/**"],
    },
  },
});
