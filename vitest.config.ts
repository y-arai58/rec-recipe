import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  test: {
    // jsdom 29 は Node 20 の require(ESM) で top-level await に当たって起動できないため happy-dom を使う
    environment: "happy-dom",
    globals: true,
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
