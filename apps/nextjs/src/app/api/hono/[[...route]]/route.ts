import { Hono } from "hono";
import { validator } from "hono/validator";
import { handle } from "hono/vercel";
import { z } from "zod";

import type { PrismaClient } from "@menus-for-ucla/db";
import {
  CarbonFootprint,
  DietaryPreferenceEnum,
  FoodAllergen,
  prisma,
} from "@menus-for-ucla/db";

export const runtime = "edge";

const app = new Hono().basePath("/api/hono");

const NutritionFactsSchema = z.object({
  servingSize: z.string(),
  calories: z.string(),
  totalFat: z.string(),
  saturatedFat: z.string(),
  transFat: z.string(),
  cholesterol: z.string(),
  sodium: z.string(),
  totalCarbohydrate: z.string(),
  dietaryFiber: z.string(),
  sugars: z.string(),
  protein: z.string(),
  calcium: z.string(),
  iron: z.string(),
  potassium: z.string(),
  vitaminD: z.string(),
});

const MenuItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  ingredients: z.string(),
  allergens: z.array(z.nativeEnum(FoodAllergen)),
  carbonFootprint: z.nativeEnum(CarbonFootprint),
  dietaryPreferences: z.array(z.nativeEnum(DietaryPreferenceEnum)),
  nutritionFacts: NutritionFactsSchema,
});

const MenuSectionSchema = z.object({
  name: z.string(),
  menuItems: z.array(MenuItemSchema),
});

const RestaurantsSchema = z.array(
  z.object({
    name: z.string(),
    menuSections: z.array(MenuSectionSchema),
    isResidentialRestaurant: z.boolean(),
  }),
);

const ActivityLevelsSchema = z.array(
  z.object({
    activityLevel: z.number().min(0).max(100),
    restaurantName: z.string(),
  }),
);

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

app.post(
  "/update-activity-level",
  validator("json", (value, c) => {
    const parsed = ActivityLevelsSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(parsed.error);
    }
    return parsed.data;
  }),
  async (c) => {
    const activityLevels = ActivityLevelsSchema.parse(await c.req.json());

    const restaurantNames = activityLevels.map((al) => al.restaurantName);

    const restaurants = await (prisma as PrismaClient).restaurant.findMany({
      where: { name: { in: restaurantNames } },
    });

    const restaurantByName = Object.fromEntries(
      restaurants.map((restaurant) => [restaurant.name, restaurant]),
    );

    for (const activityLevel of activityLevels) {
      const restaurant = restaurantByName[activityLevel.restaurantName];

      if (!restaurant) {
        return c.json({
          error: `Restaurant ${activityLevel.restaurantName} not found`,
        });
      }

      await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: { currentActivityLevel: activityLevel.activityLevel },
      });

      await prisma.activityLevel.create({
        data: {
          activityLevel: activityLevel.activityLevel,
          restaurant: { connect: { id: restaurant.id } },
        },
      });
    }

    return c.json(activityLevels);
  },
);

app.post(
  "/update-restaurants",
  validator("json", (value, c) => {
    const parsed = RestaurantsSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(parsed.error);
    }
    return parsed.data;
  }),
  async (c) => {
    const restaurantsBody = RestaurantsSchema.parse(await c.req.json());
    for (const restaurantBody of restaurantsBody) {
      const restaurant = await prisma.restaurant.upsert({
        where: { name: restaurantBody.name },
        update: {
          isResidentialRestaurant: restaurantBody.isResidentialRestaurant,
        },
        create: {
          name: restaurantBody.name,
          isResidentialRestaurant: restaurantBody.isResidentialRestaurant,
          currentActivityLevel: 0,
        },
      });

      await prisma.menuSection.deleteMany({
        where: {
          restaurantId: restaurant.id,
          name: {
            notIn: restaurantBody.menuSections.map((section) => section.name),
          },
        },
      });

      for (const section of restaurantBody.menuSections) {
        const menuSection = await prisma.menuSection.upsert({
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
            menuItems: { create: [] },
          },
        });

        for (const item of section.menuItems) {
          const allergenIds = await getAllergenIds(item.allergens);
          const dietaryPreferenceIds = await getDietaryPreferenceIds(
            item.dietaryPreferences,
          );

          await upsertMenuItem(
            item,
            menuSection.id,
            allergenIds,
            dietaryPreferenceIds,
          );
        }
      }
    }
    return c.json({ success: true });
  },
);

async function upsertMenuItem(
  item: z.infer<typeof MenuItemSchema>,
  menuSectionId: number,
  allergenIds: number[],
  dietaryPreferenceIds: number[],
) {
  await prisma.menuItem.upsert({
    where: { menuItemIdentifier: { name: item.name, menuSectionId } },
    update: {
      description: item.description,
      ingredients: item.ingredients,
      allergens: { connect: allergenIds.map((id) => ({ id })) },
      carbonFootprint: item.carbonFootprint,
      dietaryPreferences: {
        connect: dietaryPreferenceIds.map((id) => ({ id })),
      },
      nutritionFacts: { update: item.nutritionFacts },
    },
    create: {
      name: item.name,
      description: item.description,
      ingredients: item.ingredients,
      allergens: { connect: allergenIds.map((id) => ({ id })) },
      carbonFootprint: item.carbonFootprint,
      dietaryPreferences: {
        connect: dietaryPreferenceIds.map((id) => ({ id })),
      },
      nutritionFacts: { create: item.nutritionFacts },
      menuSection: { connect: { id: menuSectionId } },
    },
  });
}

async function getAllergenIds(allergens: FoodAllergen[]): Promise<number[]> {
  return Promise.all(
    allergens.map(async (allergenName) => {
      const allergen = await prisma.allergen.upsert({
        where: { name: allergenName },
        update: {},
        create: { name: allergenName },
      });
      return allergen.id;
    }),
  );
}

async function getDietaryPreferenceIds(
  dietaryPreferences: DietaryPreferenceEnum[],
): Promise<number[]> {
  return Promise.all(
    dietaryPreferences.map(async (preferenceName) => {
      const preference = await prisma.dietaryPreference.upsert({
        where: { name: preferenceName },
        update: {},
        create: { name: preferenceName },
      });
      return preference.id;
    }),
  );
}

const handler = handle(app);
export const GET = handler;
export const POST = handler;
