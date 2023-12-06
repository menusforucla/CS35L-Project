import { z } from "zod";

import { MealType } from "@menus-for-ucla/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const restaurantRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.restaurant.findMany({ orderBy: { id: "desc" } });
  }),

  byId: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    const mealType: MealType = getMealType();
    console.log(mealType);
    return ctx.prisma.restaurant.findUnique({
      where: { id: input },
      include: {
        menuSections: {
          where: { mealType: mealType },
          include: {
            menuItems: {
              include: {
                allergens: true,
                dietaryPreferences: true,
              },
            },
          },
        },
      },
    });
  }),
});

function getMealType(): MealType {
  // Get the current time in Los Angeles timezone
  const now = new Date().toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
  });

  // Convert the time to a Date object for easier comparison
  const currentTime = new Date(`1970-01-01T${now}`);

  // Define the time ranges for meals
  const breakfastStart = new Date("1970-01-01T00:00:00");
  const breakfastEnd = new Date("1970-01-01T10:00:00");
  const lunchStart = new Date("1970-01-01T10:00:00");
  const lunchEnd = new Date("1970-01-01T16:00:00");
  const dinnerStart = new Date("1970-01-01T16:00:00");
  const dinnerEnd = new Date("1970-01-01T24:00:00");

  // Check and print the current meal time
  if (currentTime >= breakfastStart && currentTime < breakfastEnd) {
    return MealType.BREAKFAST;
  } else if (currentTime >= lunchStart && currentTime < lunchEnd) {
    return MealType.LUNCH;
  } else if (
    (currentTime >= dinnerStart && currentTime < dinnerEnd) ||
    currentTime < breakfastStart
  ) {
    return MealType.DINNER;
  } else {
    return MealType.DINNER;
  }
}
