import type { NextConfig } from "next";

const isPagesDeployment = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isPagesDeployment && { basePath: "/blade-builder" }),
};

export default nextConfig;
