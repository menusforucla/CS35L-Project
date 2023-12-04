import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const ImageSchema = z.object({
  url: z.string(),
  type: z.string(),
});

export const imageRouter = createTRPCRouter({
  upload: protectedProcedure.input(ImageSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.image.create({
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
