import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const ImageSchema = z.object({
  url: z.string(),
  type: z.string(),
  menuItemId: z.number(),
});

export const imageRouter = createTRPCRouter({
  create: protectedProcedure.input(ImageSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.image.create({
      data: {
        menuItemId: input.menuItemId,
        url: input.url,
        type: input.type,
      },
    });
  }),

  //   byReviewId: publicProcedure.input(z.number()).query(({ ctx, input }) => {
  //     return ctx.prisma.review.findMany({
  //       where: { restaurantId: input },
  //     });
  //   }),

  //   delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
  //     return ctx.prisma.review.delete({
  //       where: { id: input },
  //     });
  //   }),
});
