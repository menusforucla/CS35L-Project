import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const restaurantRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.restaurant.findMany({ orderBy: { id: "desc" } });
  }),

  byId: publicProcedure
    .input(z.number())
    .query(({ ctx, input }) => {
      return ctx.prisma.restaurant.findUnique({
        where: { id: input },
        include: {
          menuSections: {
            include: { menuItems: true },
          },
        },
      });
    }),
});
