import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import * as cheerio from "cheerio";
import { z } from "zod";

import type { MealType, MenuItem, MenuSection } from "@menus-for-ucla/db";
import {
  CarbonFootprint,
  DietaryPreferenceEnum,
  FoodAllergen,
  prisma,
} from "@menus-for-ucla/db";

const hoursUrl = "http://menu.dining.ucla.edu/Hours";

const intervalsForFunctions = {
  scrapeMenus: 24 * 60 * 60 * 1000, // once a day
  scrapeActivityLevels: 60 * 60 * 1000, // every 5 minutes
  scrapeHours: 24 * 60 * 60 * 1000, // once a day
};

const menuUrl = "http://menu.dining.ucla.edu/Menus";
const restaurantNames: string[] = ["DeNeve", "BruinPlate", "Epicuria"];
const mealTypes = ["Breakfast", "Lunch", "Dinner"];

const restaurantUrls: string[] = [
  "http://menu.dining.ucla.edu/Menus/DeNeve/Breakfast",
  "http://menu.dining.ucla.edu/Menus/DeNeve/Lunch",
  "http://menu.dining.ucla.edu/Menus/DeNeve/Dinner",
  "http://menu.dining.ucla.edu/Menus/BruinPlate/Breakfast",
  "http://menu.dining.ucla.edu/Menus/BruinPlate/Lunch",
  "http://menu.dining.ucla.edu/Menus/BruinPlate/Dinner",
  "http://menu.dining.ucla.edu/Menus/Epicuria/Dinner",
];

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

const RestaurantsSchema = z.object({
  name: z.string(),
  menuSections: z.array(MenuSectionSchema),
  isResidentialRestaurant: z.boolean(),
});

const ActivityLevelsSchema = z.array(
  z.object({
    activityLevel: z.number().min(0).max(100),
    restaurantName: z.string(),
  }),
);

interface ActivityData {
  restaurantName: string;
  activityLevel: number;
}

interface NutritionalInfo {
  servingSize: string;
  caloriesPerServing: string;
  macronutrients: macro[];
  vitamins: [string, number][];
  ingredients: string[];
  allergens: string[];
  options: string[];
}

interface macro {
  name: string;
  grams: string;
  dv: number;
  indented: boolean;
}

function scrapeActivityLevels() {
  axios
    .get(hoursUrl)
    .then((response) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const $ = cheerio.load(response.data);
      const activityData: ActivityData[] = [];

      $("table.hours-table tr").map((index, element) => {
        const restaurantName = $(element)
          .find("span.hours-location")
          .text()
          .trim();
        const activity = $(element)
          .find("span.activity-level-box")
          .text()
          .trim();

        const percentage = parseInt(activity.slice(0, -1), 10);
        if (
          ActivityLevelsSchema.safeParse([
            { activityLevel: percentage, restaurantName: restaurantName },
          ]).success
        ) {
          activityData.push({ restaurantName, activityLevel: percentage });
        }
      });
      void updateActivityLevel(activityData);
    })
    .catch((error: AxiosError) => {
      console.log(`Error fetching data from ${hoursUrl}: ${error.message}`);
    });
}

async function updateActivityLevel(activityData: ActivityData[]) {
  for (const activityLevel of activityData) {
    const restaurant = await prisma.restaurant.upsert({
      where: { name: activityLevel.restaurantName },
      create: {
        name: activityLevel.restaurantName,
        currentActivityLevel: activityLevel.activityLevel,
      },
      update: { currentActivityLevel: activityLevel.activityLevel },
    });

    await prisma.activityLevel.create({
      data: {
        activityLevel: activityLevel.activityLevel,
        restaurant: { connect: { id: restaurant.id } },
      },
    });
  }
}

async function scrapeMenus() {
  for (const restaurantName of restaurantNames) {
    for (const mealType of mealTypes) {
      const restaurantUrl = `${menuUrl}/${restaurantName}/${mealType}`;
      await scrapeMenu(restaurantUrl, restaurantName, mealType);
    }
  }
}

function scrapeMenu(
  restaurantUrl: string,
  restaurantName: string,
  mealType: string,
): Promise<void> {
  return axios
    .get(restaurantUrl)
    .then(async (response) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const $ = cheerio.load(response.data);
      const menuSections: MenuSection[] = [];
      const sections = $("li.sect-item").toArray();

      const restaurant = await prisma.restaurant.upsert({
        where: { name: restaurantName },
        create: { name: restaurantName, currentActivityLevel: 0 },
        update: {},
      });

      for (const section of sections) {
        await scrapeMenuSection($, section, mealType, restaurant.id);
        // menuSections.push(menuSection);
      }

      // const restaurant: Restaurant = {
      //   name: restaurantName,
      //   isResidentialRestaurant: false,
      //   menuSections: menuSections,
      // };
    })
    .catch((error: AxiosError) => {
      console.error(
        `Error fetching data from ${restaurantUrl}: ${error.message}`,
      );
    });
}

async function scrapeMenuSection(
  $: cheerio.CheerioAPI,
  section: cheerio.Element,
  mealType: string,
  restaurantId: number,
) {
  const sectionName: string = $(section).text().split("\n")[1].trim();
  const items = $(section).find("a.recipelink").toArray();

  const menuSection = await prisma.menuSection.upsert({
    where: {
      menuSectionIdentifier: {
        name: section.name,
        restaurantId: restaurantId,
      },
    },
    update: {},
    create: {
      name: section.name,
      restaurant: { connect: { id: restaurantId } },
      menuItems: { create: [] },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      mealType: mealType.toUpperCase() as MealType,
    },
  });

  for (const item of items) {
    const url = $(item).attr("href");
    await scrapeMenuItem(url!, menuSection.id);
    // menuItems.push(menuItem);
  }

  // const menuSection: MenuSection = {
  //   name: sectionName,
  //   mealType: mealType.toUpperCase() as MealType,
  //   menuItems: menuItems,
  // };
  // return menuSection;
}

async function scrapeMenuItem(url: string, menuSectionId: number) {
  try {
    const html: AxiosResponse<string> = await axios.get(url);
    if (html.status !== 200) {
      throw new Error(`Error fetching data from ${url}`);
    }

    const $ = cheerio.load(html.data);

    //scrape vitamins
    const vitamins: [string, number][] = [];
    $(".nfvitleft, .nfvitright").map((index, element) => {
      vitamins.push([
        $(element).find(".nfvitname").text().trim(),
        parseInt($(element).find(".nfvitpct").text().trim().slice(0, -1)),
      ]);
    });

    const macros: macro[] = [];
    $(".nfnutrient").map((index, element) => {
      const dailyValue = parseInt($(element).find(".nfdvvalnum").text().trim());
      const fullText = $(element).text().split(" ");
      const name = fullText.slice(0, -2).join(" ");
      const grams = fullText.slice(-2, -1).join(" ");
      const indented = $(element).parent(".nfindent").length > 0;
      const macro: macro = {
        name: name,
        grams: grams,
        dv: dailyValue,
        indented: indented,
      };
      macros.push(macro);
    });

    const nutrition: NutritionalInfo = {
      servingSize: $(".nfserv").text().slice(13).trim(),
      caloriesPerServing: $(".nfcal").text().slice(9).trim(),
      macronutrients: macros,
      vitamins: vitamins,
      options: $(".prodwebcode")
        .map((index, element) => $(element).text().trim())
        .get(),
    };
    console.log(nutrition);

    const rawAllerges: string[] = $(".ingred_allergen > p")
      .eq(1)
      .text()
      .slice(12)
      .split(/\s*,\s*(?![^()]*\))/);

    const allergens: FoodAllergen[] = [];
    for (const rawAllergen of rawAllerges) {
      allergens.push(FoodAllergen[rawAllergen as keyof typeof FoodAllergen]);
    }
    const allergenIds = await getAllergenIds(allergens);

    const menuItem: MenuItem = {
      name: $("h2").text().trim(),
      description: $(".recipe_description").text().trim(),
      ingredients: $(".ingred_allergen").find("p").first().text(),
      carbonFootprint: CarbonFootprint.LOW,
    };

    upsertMenuItem(menuItem)
  } catch (error) {
    console.error(
      `Error fetching nutritional information from ${url}: ${
        (error as AxiosError).message
      }`,
    );
    throw error;
  }
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

// scrapeActivityLevels();
void scrapeMenus();

// scrapeMenu(1);
//scrapeNutrition("http://menu.dining.ucla.edu/Recipes/979336/1"); // for debugging

//checking for completion

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
