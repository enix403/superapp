import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tsconfigPaths(), tailwindcss(), react()],

  server: {
    port: 3000,
    host: "0.0.0.0"
  }
});
