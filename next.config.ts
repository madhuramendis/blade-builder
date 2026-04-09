import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Uncomment and set to your GitHub repo name before deploying:
  // basePath: "/your-repo-name",
};

export default nextConfig;
