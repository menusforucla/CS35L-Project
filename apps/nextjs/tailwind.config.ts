import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

import baseConfig from "@menus-for-ucla/tailwind-config";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default withUt({
  content: ["./src/**/*.{ts,tsx}"],
  presets: [baseConfig],
}) satisfies Config;
