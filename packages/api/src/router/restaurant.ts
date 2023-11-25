import { z } from "zod";

import type { PrismaClient } from "@menus-for-ucla/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const restaurantRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    const prisma = ctx.prisma as PrismaClient;
    return prisma.restaurant.findMany({ orderBy: { id: "desc" } });
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      const prisma = ctx.prisma as PrismaClient;
      return prisma.restaurant.findUnique({
        where: { id: input.id },
        include: {
          menuSections: {
            include: { menuItems: true },
          },
        },
      });
    }),
});
