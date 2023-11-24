import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { restaurantRouter } from "./router/restaurant";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  restaurant: restaurantRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
