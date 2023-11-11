import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@menus-for-ucla/api";

export const api = createTRPCReact<AppRouter>();

export { type RouterInputs, type RouterOutputs } from "@menus-for-ucla/api";
