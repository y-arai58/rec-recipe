import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/rec-recipe",
  images: {
    unoptimized: true,
  },
}

export default nextConfig
