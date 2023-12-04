import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

import baseConfig from "@menus-for-ucla/tailwind-config";

export default withUt({
  content: ["./src/**/*.{ts,tsx,mdx}"],
  presets: [baseConfig],
}) satisfies Config;
