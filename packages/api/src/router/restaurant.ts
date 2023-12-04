import { z } from "zod";

import type { PrismaClient } from "@menus-for-ucla/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const restaurantRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    const prisma = ctx.prisma as PrismaClient;
    return prisma.restaurant.findMany({ orderBy: { id: "desc" } });
  }),

  byId: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    const prisma = ctx.prisma as PrismaClient;
    return prisma.restaurant.findUnique({
      where: { id: input },
      include: {
        menuSections: {
          include: { menuItems: true },
        },
      },
    });
  }),
});
