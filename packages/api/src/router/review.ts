import { z } from "zod";

import type { PrismaClient } from "@menus-for-ucla/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const ImageSchema = z.object({
  url: z.string(),
  type: z.string(),
});

const ReviewSchema = z.object({
  rating: z.number(),
  review: z.string(),
  images: z.array(ImageSchema),
  restaurantId: z.number(),
  menuItemIds: z.array(z.number()).optional(),
});

export const reviewRouter = createTRPCRouter({
  create: protectedProcedure.input(ReviewSchema).mutation(({ ctx, input }) => {
    const prisma = ctx.prisma as PrismaClient;
    return prisma.review.create({
      data: {
        rating: input.rating,
        review: input.review,
        images: {
          create: input.images,
        },
        menuItems: {
          connect: input.menuItemIds?.map((id) => ({ id })) ?? [],
        },
        restaurantId: input.restaurantId,
        userId: ctx.session.user.id,
      },
    });
  }),

});