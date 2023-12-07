// Importing env files here to validate on build
import "./src/env.mjs";
import "@menus-for-ucla/auth/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@menus-for-ucla/api", "@menus-for-ucla/auth", "@menus-for-ucla/db", "react-nutrition-label"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default config;
