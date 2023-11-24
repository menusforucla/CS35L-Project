import { z } from "zod";

import {
  CarbonFootprint,
  DietaryPreferenceEnum,
  FoodAllergen,
} from "@menus-for-ucla/db";

import {
  createTRPCRouter,
  internalProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

export const restaurantRouter = createTRPCRouter({
  create: publicProcedure
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const restaurant = await ctx.prisma.restaurant.upsert({
        where: { name: input.name },
        update: {
          isResidentialRestaurant: input.isResidentialRestaurant,
        },
        create: {
          name: input.name,
          isResidentialRestaurant: input.isResidentialRestaurant,
        },
      });

      await ctx.prisma.menuSection.deleteMany({
        where: {
          restaurantId: restaurant.id,
          name: {
            notIn: input.menuSections.map((section) => section.name),
          },
        },
      });

      for (const section of input.menuSections) {
        const menuSection = await ctx.prisma.menuSection.upsert({
          where: {
            menuSectionIdentifier: {
              name: section.name,
              restaurantId: restaurant.id,
            },
          },
          update: {},
          create: {
            name: section.name,
            restaurant: { connect: { id: restaurant.id } },
          },
        });

        for (const item of section.menuItems) {
          await ctx.prisma.menuItem.upsert({
            where: {
              menuItemIdentifier: {
                name: item.name,
                menuSectionId: menuSection.id,
              },
            },
            update: {
              description: item.description,
              ingredients: item.ingredients,
              allergens: {
                connectOrCreate: item.allergens.map((allergen) => ({
                  where: { name: allergen },
                  create: { name: allergen, menuItems: { connect: item.name } },
                  update: { menuItems: { connect: item.name } },
                })),
              },
              carbonFootprint: item.carbonFootprint,
              dietaryPreferences: {
                connectOrCreate: item.dietaryPreferences.map(
                  (dietaryPreference) => ({
                    where: { name: dietaryPreference },
                    create: {
                      name: dietaryPreference,
                      menuItems: { connect: item.name },
                    },
                    update: { menuItems: { connect: item.name } },
                  }),
                ),
              },
              nutritionFacts: {
                update: item.nutritionFacts,
              },
            },
            create: {
              name: item.name,
              description: item.description,
              ingredients: item.ingredients,
              allergens: {
                connectOrCreate: item.allergens.map((allergen) => ({
                  where: { name: allergen },
                  create: { name: allergen, menuItems: { connect: item.name } },
                  update: { menuItems: { connect: item.name } },
                })),
              },
              carbonFootprint: item.carbonFootprint,
              dietaryPreferences: {
                connectOrCreate: item.dietaryPreferences.map(
                  (dietaryPreference) => ({
                    where: { name: dietaryPreference },
                    create: {
                      name: dietaryPreference,
                      menuItems: { connect: item.name },
                    },
                    update: { menuItems: { connect: item.name } },
                  }),
                ),
              },
              nutritionFacts: {
                create: item.nutritionFacts,
              },
              menuSection: { connect: { id: menuSection.id } },
            },
          });
        }
      }

      return restaurant;
    }),

  //   delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
  //     return ctx.prisma.restaurant.delete({ where: { id: input } });
  //   }),
});
