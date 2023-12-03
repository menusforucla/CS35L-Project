import { authRouter } from "./router/auth";
import { menuItemRouter } from "./router/menu-item";
import { restaurantRouter } from "./router/restaurant";
import { reviewRouter } from "./router/review";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  restaurant: restaurantRouter,
  menuItemRouter: menuItemRouter,
  review: reviewRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
