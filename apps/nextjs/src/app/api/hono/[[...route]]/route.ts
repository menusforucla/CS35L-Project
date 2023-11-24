import { Hono } from "hono";
import { validator } from "hono/validator";
import { handle } from "hono/vercel";
import { z } from "zod";

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

const RestaurantSchema = z.object({
  name: z.string(),
  menuSections: z.array(MenuSectionSchema),
  isResidentialRestaurant: z.boolean(),
});

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

app.post(
  "/update-restaurants",
  validator("json", (value, c) => {
    const parsed = RestaurantSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(parsed.error);
    }
    return parsed.data;
  }),
  async (c) => {
    const restaurantBody = RestaurantSchema.parse(await c.req.json());
    const restaurant = await prisma.restaurant.upsert({
      where: { name: restaurantBody.name },
      update: {
        isResidentialRestaurant: restaurantBody.isResidentialRestaurant,
      },
      create: {
        name: restaurantBody.name,
        isResidentialRestaurant: restaurantBody.isResidentialRestaurant,
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

    return c.json(restaurant);
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
