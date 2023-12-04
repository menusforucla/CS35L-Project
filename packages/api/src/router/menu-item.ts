import { z } from "zod";

import {
  CarbonFootprint,
  DietaryPreferenceEnum,
  FoodAllergen,
} from "@menus-for-ucla/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const menuItemRouter = createTRPCRouter({
  byId: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.menuItem.findUnique({
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

  byAttributes: publicProcedure
    .input(
      z.object({
        restaurantId: z.number(),
        allergens: z.array(z.nativeEnum(FoodAllergen)).optional(),
        carbonFootprint: z.nativeEnum(CarbonFootprint),
        dietaryPreferences: z
          .array(z.nativeEnum(DietaryPreferenceEnum))
          .optional(),
      }),
    )
    .query(({ ctx, input }) => {
      const { restaurantId, allergens, dietaryPreferences } = input;

      return ctx.prisma.menuItem.findMany({
        where: {
          id: restaurantId,
          allergens: {
            some: {
              name: {
                in: allergens ?? [],
              },
            },
          },
          carbonFootprint: input.carbonFootprint ?? undefined,
          dietaryPreferences: {
            some: {
              name: {
                in: dietaryPreferences ?? [],
              },
            },
          },
        },
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
