import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Avoid picking a parent-folder lockfile as the workspace root on local builds.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
