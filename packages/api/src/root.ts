import { authRouter } from "./router/auth";
import { restaurantRouter } from "./router/restaurant";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  restaurant: restaurantRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
