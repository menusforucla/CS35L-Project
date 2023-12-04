import { z } from "zod";

import type { PrismaClient } from "@menus-for-ucla/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const menuItemRouter = createTRPCRouter({
  byId: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    const prisma = ctx.prisma as PrismaClient;
    return prisma.menuItem.findUnique({
      where: { id: input },
      include: {
        allergens: true,
        dietaryPreferences: true,
        nutritionFacts: true,
        images: true,
        reviews: true,
      },
    });
  }),
});
