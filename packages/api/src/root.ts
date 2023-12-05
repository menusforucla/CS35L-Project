import { authRouter } from "./router/auth";
import { imageRouter } from "./router/image";
import { menuItemRouter } from "./router/menu-item";
import { restaurantRouter } from "./router/restaurant";
import { reviewRouter } from "./router/review";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  restaurant: restaurantRouter,
  menuItemRouter: menuItemRouter,
  review: reviewRouter,
  image: imageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
