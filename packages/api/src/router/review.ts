import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const ImageSchema = z.object({
  url: z.string(),
  type: z.string(),
});

const ReviewSchema = z.object({
  rating: z.number(),
  review: z.string(),
  images: z.array(ImageSchema).optional(),
  restaurantId: z.number(),
  menuItemIds: z.array(z.number()).optional(),
});

export const reviewRouter = createTRPCRouter({
  create: protectedProcedure.input(ReviewSchema).mutation(({ ctx, input }) => {
    console.log(input);
    return ctx.prisma.review.create({
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

  byRestaurantId: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.review.findMany({
        where: { restaurantId: input },
        include: {
          user: true,
        },
      });
    }),

  byMenuItemId: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.review.findMany({
        where: {
          menuItems: {
            some: { id: input },
          },
        },
        include: {
          user: true,
        },
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.review.delete({
      where: { id: input },
    });
  }),
});
