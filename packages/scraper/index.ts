import axios, { AxiosError } from "axios";
import * as cheerio from "cheerio";
import { z } from "zod";

import {
  CarbonFootprint,
  DietaryPreferenceEnum,
  FoodAllergen,
} from "@menus-for-ucla/db";

const hoursURL = "http://menu.dining.ucla.edu/Hours";

const diningURLs: string[] = [
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

interface ActivityData {
  name: string;
  percentage: number;
}

type MenuItem = {
  name: string;
  section: string;
  link: string;
  nutrition: NutritionalInfo;
};

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

//scrape dining hall availability
export function scrapeHours() {
  axios
    .get(hoursURL)
    .then((response) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const $ = cheerio.load(response.data);
      const activityData: ActivityData[] = [];

      $("table.hours-table tr").map((index, element) => {
        const name = $(element).find("span.hours-location").text().trim();
        const activity = $(element)
          .find("span.activity-level-box")
          .text()
          .trim();

        const percentage = parseInt(activity.slice(0, -1), 10);
        if (name && !isNaN(percentage)) {
          activityData.push({ name, percentage });
        }
      });

      console.log(activityData);
    })
    .catch((error: AxiosError) => {
      console.log(`Error fetching data from ${hoursURL}: ${error.message}`);
    });
}

// async function scrapeMenu(menuOption: number): Promise<void> {
//   try {
//     const html: AxiosResponse<string> = await axios.get(diningURLs[menuOption]);
//     if (html.status !== 200) {
//       throw new Error(`Error fetching data from ${diningURLs[menuOption]}`);
//     }

//     const $ = cheerio.load(html.data);
//     const menuItems: MenuItem[] = [];
//     const sections = $("li.sect-item").toArray();
//     for (const section of sections) {
//       // for each section
//       const sectionName: string = $(section).text().split("\n")[1].trim();
//       const items = $(section).find("a.recipelink").toArray();
//       for (const item of items) {
//         const menuItem: MenuItem = {
//           name: $(item).text(),
//           section: sectionName,
//           link: String($(item).attr("href")),
//           nutrition: await scrapeNutrition(String($(item).attr("href"))),
//         };
//         menuItems.push(menuItem);
//       }
//     }
//     console.log(menuItems);
//   } catch (error) {
//     console.log(
//       `Error fetching data from ${diningURLs[menuOption]}: ${
//         (error as AxiosError).message
//       }`,
//     );
//   }
// }

// async function scrapeNutrition(url: string): Promise<NutritionalInfo> {
//   try {
//     const html: AxiosResponse<string> = await axios.get(url);

//     if (html.status !== 200) {
//       throw new Error(`Error fetching data from ${url}`);
//     }

//     const $ = cheerio.load(html.data);

//     //scrape serving size
//     //const servingSize = $('.nfserv').text().slice(13).trim();
//     //scrape calories per serving
//     //const caloriesPerServing = $('.nfcal').text().slice(9).trim();
//     //scrape ingredients
//     //const ingredientsString = $('.ingred_allergen').find('p').first().text().slice(13);
//     //const ingredients = ingredientsString.split(/\s*,\s*(?![^()]*\))/);
//     //scrape allergens
//     //splits ingredients by using a negative lookahead assertion to check for close paren
//     //const allergens = $('.ingred_allergen > p').eq(1).text().slice(12).split(/\s*,\s*(?![^()]*\))/);
//     //scrape options
//     //const options = $('.prodwebcode').map((index, element) => $(element).text().trim()).get();

//     //scrape vitamins
//     const vitamins: [string, number][] = [];
//     $(".nfvitleft, .nfvitright").map((index, element) => {
//       vitamins.push([
//         $(element).find(".nfvitname").text().trim(),
//         parseInt($(element).find(".nfvitpct").text().trim().slice(0, -1)),
//       ]);
//     });

//     const macros: macro[] = [];
//     $(".nfnutrient").map((index, element) => {
//       const dailyValue = parseInt($(element).find(".nfdvvalnum").text().trim());
//       const fullText = $(element).text().split(" ");
//       const name = fullText.slice(0, -2).join(" ");
//       const grams = fullText.slice(-2, -1).join(" ");
//       const indented = $(element).parent(".nfindent").length > 0;
//       const macro: macro = {
//         name: name,
//         grams: grams,
//         dv: dailyValue,
//         indented: indented,
//       };
//       macros.push(macro);
//     });

//     const nutrition: NutritionalInfo = {
//       servingSize: $(".nfserv").text().slice(13).trim(),
//       caloriesPerServing: $(".nfcal").text().slice(9).trim(),
//       macronutrients: macros,
//       vitamins: vitamins,
//       ingredients: $(".ingred_allergen")
//         .find("p")
//         .first()
//         .text()
//         .slice(13)
//         .split(/\s*,\s*(?![^()]*\))/),
//       allergens: $(".ingred_allergen > p")
//         .eq(1)
//         .text()
//         .slice(12)
//         .split(/\s*,\s*(?![^()]*\))/),
//       options: $(".prodwebcode")
//         .map((index, element) => $(element).text().trim())
//         .get(),
//     };
//     return nutrition;
//   } catch (error) {
//     console.error(
//       `Error fetching nutritional information from ${url}: ${
//         (error as AxiosError).message
//       }`,
//     );
//     throw error;
//   }
// }

scrapeHours();
// scrapeMenu(1);
//scrapeNutrition("http://menu.dining.ucla.edu/Recipes/979336/1"); // for debugging

//checking for completion