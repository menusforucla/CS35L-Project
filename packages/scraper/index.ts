import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import * as cheerio from "cheerio";
import { z } from "zod";

import type {
  MealType,
  MenuItem,
  MenuSection,
  NutritionFacts,
} from "@menus-for-ucla/db";
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
      const sections = $("li.sect-item").toArray();

      const restaurant = await prisma.restaurant.upsert({
        where: { name: restaurantName },
        create: { name: restaurantName, currentActivityLevel: 0 },
        update: {},
      });

      for (const section of sections) {
        await scrapeMenuSection($, section, mealType, restaurant.id);
      }
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
        name: sectionName,
        restaurantId: restaurantId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        mealType: mealType.toUpperCase() as MealType,
      },
    },
    update: {},
    create: {
      name: sectionName,
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

  return menuSection;
}

async function scrapeMenuItem(url: string, menuSectionId: number) {
  try {
    const html: AxiosResponse<string> = await axios.get(url);
    if (html.status !== 200) {
      throw new Error(`Error fetching data from ${url}`);
    }

    const $ = cheerio.load(html.data);

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

    const nutritionFacts = {
      servingSize: $(".nfserv").text().slice(13).trim(),
      calories: $(".nfcal").text().slice(9).trim(),
      totalFat: macros[0].grams,
      saturatedFat: macros[1].grams,
      transFat: macros[2].grams,
      cholesterol: macros[3].grams,
      sodium: macros[4].grams,
      totalCarbohydrate: macros[5].grams,
      dietaryFiber: macros[6].grams,
      sugars: macros[7].grams,
      protein: macros[8].grams,
      calcium: vitamins[0][1].toString(),
      iron: vitamins[1][1].toString(),
      potassium: vitamins[2][1].toString(),
      vitaminD: vitamins[3][1].toString(),
    };

    let carbonFootprint: CarbonFootprint = CarbonFootprint.LOW;
    const dietaryPreferences: DietaryPreferenceEnum[] = [];
    const allergens: FoodAllergen[] = [];

    const menuItemLabels = $(".prodwebcode")
      .map((index, element) => $(element).text().trim())
      .get();
    for (const label of menuItemLabels) {
      switch (label) {
        case "Low Carbon Footprint":
          carbonFootprint = CarbonFootprint.LOW;
          break;
        case "High Carbon Footprint":
          carbonFootprint = CarbonFootprint.HIGH;
          break;
        case "Vegeterian Menu Option":
          dietaryPreferences.push(DietaryPreferenceEnum.VEGETARIAN);
          break;
        case "Vegan Menu Option":
          dietaryPreferences.push(DietaryPreferenceEnum.VEGAN);
          break;
        case "Prepared with Alcohol":
          dietaryPreferences.push(DietaryPreferenceEnum.PREPARED_WITH_ALCOHOL);
          break;
        case "Halal Menu Option":
          dietaryPreferences.push(DietaryPreferenceEnum.HALAL);
          break;
        case "Contains Dairy":
          allergens.push(FoodAllergen.DAIRY);
          break;
        case "Contains Egg":
          allergens.push(FoodAllergen.EGGS);
          break;
        case "Contains Peanut":
          allergens.push(FoodAllergen.PEANUTS);
          break;
        case "Contains Tree Nuts":
          allergens.push(FoodAllergen.TREE_NUTS);
          break;
        case "Contains Wheat":
          allergens.push(FoodAllergen.WHEAT);
          break;
        case "Contains Soy":
          allergens.push(FoodAllergen.SOYBEANS);
          break;
        case "Contains Fish":
          allergens.push(FoodAllergen.FISH);
          break;
        case "Contains Crustacean Shellfish":
          allergens.push(FoodAllergen.CRUSTACEAN_SHELLFISH);
          break;
        case "Contains Sesame":
          allergens.push(FoodAllergen.SESAME);
          break;
        default:
          break;
      }
    }

    const allergensText: string = $(".ingred_allergen > p")
      .eq(1)
      .text()
      .slice(12);

    const allergenIds = await getAllergenIds(allergens);

    const dietaryPreferenceIds =
      await getDietaryPreferenceIds(dietaryPreferences);

    const name = $("h2").text().trim();
    const description = $("description").text().trim();
    const ingredients = $(".ingred_allergen")
      .find("p")
      .first()
      .text()
      .slice(13);

    await prisma.menuItem.upsert({
      where: { menuItemIdentifier: { name: name, menuSectionId } },
      update: {
        description: description,
        ingredients: ingredients,
        allergens: { connect: allergenIds.map((id) => ({ id })) },
        carbonFootprint: carbonFootprint,
        dietaryPreferences: {
          connect: dietaryPreferenceIds.map((id) => ({ id })),
        },
        allergensText: allergensText,
        nutritionFacts: {
          upsert: {
            create: nutritionFacts,
            update: nutritionFacts,
          },
        },
        menuSection: { connect: { id: menuSectionId } },
      },
      create: {
        name: name,
        description: description,
        ingredients: ingredients,
        allergens: { connect: allergenIds.map((id) => ({ id })) },
        carbonFootprint: carbonFootprint,
        dietaryPreferences: {
          connect: dietaryPreferenceIds.map((id) => ({ id })),
        },
        allergensText: allergensText,
        nutritionFacts: { create: nutritionFacts },
        menuSection: { connect: { id: menuSectionId } },
      },
    });
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

// scrapeActivityLevels();
void scrapeMenus();

// scrapeMenu(1);
//scrapeNutrition("http://menu.dining.ucla.edu/Recipes/979336/1"); // for debugging

//checking for completion
