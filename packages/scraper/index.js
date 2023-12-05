"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeHours = void 0;
var axios_1 = require("axios");
var cheerio = require("cheerio");
var zod_1 = require("zod");
var db_1 = require("@menus-for-ucla/db");
var hoursURL = "http://menu.dining.ucla.edu/Hours";
var diningURLs = [
    "http://menu.dining.ucla.edu/Menus/DeNeve/Breakfast",
    "http://menu.dining.ucla.edu/Menus/DeNeve/Lunch",
    "http://menu.dining.ucla.edu/Menus/DeNeve/Dinner",
    "http://menu.dining.ucla.edu/Menus/BruinPlate/Breakfast",
    "http://menu.dining.ucla.edu/Menus/BruinPlate/Lunch",
    "http://menu.dining.ucla.edu/Menus/BruinPlate/Dinner",
    "http://menu.dining.ucla.edu/Menus/Epicuria/Dinner",
];
var NutritionFactsSchema = zod_1.z.object({
    servingSize: zod_1.z.string(),
    calories: zod_1.z.string(),
    totalFat: zod_1.z.string(),
    saturatedFat: zod_1.z.string(),
    transFat: zod_1.z.string(),
    cholesterol: zod_1.z.string(),
    sodium: zod_1.z.string(),
    totalCarbohydrate: zod_1.z.string(),
    dietaryFiber: zod_1.z.string(),
    sugars: zod_1.z.string(),
    protein: zod_1.z.string(),
    calcium: zod_1.z.string(),
    iron: zod_1.z.string(),
    potassium: zod_1.z.string(),
    vitaminD: zod_1.z.string(),
});
var MenuItemSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    ingredients: zod_1.z.string(),
    allergens: zod_1.z.array(zod_1.z.nativeEnum(db_1.FoodAllergen)),
    carbonFootprint: zod_1.z.nativeEnum(db_1.CarbonFootprint),
    dietaryPreferences: zod_1.z.array(zod_1.z.nativeEnum(db_1.DietaryPreferenceEnum)),
    nutritionFacts: NutritionFactsSchema,
});
var MenuSectionSchema = zod_1.z.object({
    name: zod_1.z.string(),
    menuItems: zod_1.z.array(MenuItemSchema),
});
var RestaurantsSchema = zod_1.z.array(zod_1.z.object({
    name: zod_1.z.string(),
    menuSections: zod_1.z.array(MenuSectionSchema),
    isResidentialRestaurant: zod_1.z.boolean(),
}));
var ActivityLevelsSchema = zod_1.z.array(zod_1.z.object({
    activityLevel: zod_1.z.number().min(0).max(100),
    restaurantName: zod_1.z.string(),
}));
//scrape dining hall availability
function scrapeHours() {
    axios_1.default
        .get(hoursURL)
        .then(function (response) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        var $ = cheerio.load(response.data);
        var activityData = [];
        $("table.hours-table tr").map(function (index, element) {
            var name = $(element).find("span.hours-location").text().trim();
            var activity = $(element)
                .find("span.activity-level-box")
                .text()
                .trim();
            var percentage = parseInt(activity.slice(0, -1), 10);
            if (name && !isNaN(percentage)) {
                activityData.push({ name: name, percentage: percentage });
            }
        });
        console.log(activityData);
    })
        .catch(function (error) {
        console.log("Error fetching data from ".concat(hoursURL, ": ").concat(error.message));
    });
}
exports.scrapeHours = scrapeHours;
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
