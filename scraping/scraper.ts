//imports
import * as cheerio from 'cheerio'; // scraping library
import { default as axios } from 'axios'; //html library
import { AxiosResponse } from 'axios';

//dining urls
//0 represents hours of operations
//1-3 are De Neve at various meal times
//4-6 are BPlate at various meal times
//7 is Epicuria dinner menu
const diningURLs: string[] = [
    'http://menu.dining.ucla.edu/Hours',
    'http://menu.dining.ucla.edu/Menus/DeNeve/Breakfast',
    'http://menu.dining.ucla.edu/Menus/DeNeve/Lunch',
    'http://menu.dining.ucla.edu/Menus/DeNeve/Dinner',
    'http://menu.dining.ucla.edu/Menus/BruinPlate/Breakfast',
    'http://menu.dining.ucla.edu/Menus/BruinPlate/Lunch',
    'http://menu.dining.ucla.edu/Menus/BruinPlate/Dinner',
    'http://menu.dining.ucla.edu/Menus/Epicuria/Dinner'
];

//create interfaces to store data while scraping

//ActivityData represents snapshots in time of information about a dining location
//name represents name of dining location (includes all locations, not just residential), percentage represents activity level
interface ActivityData {
    name: string
    percentage: number
}

//MenuItem stores all relevant information about a given menu item
//name is name of menu item, section is the subsection of restaurant the item is in, 
//link is to nutritional information on dining website, nutrition is scraped information
interface MenuItem {
    name: string;
    section: string;
    link: string;
    nutrition: NutritionalInfo;
};

//NutritionalInfo represents nutritional information about a specific menu item, with largely self explanatory names
//options represents the food information circles/icons on the dining website, with dietary restriction information
interface NutritionalInfo {
    servingSize: string;
    caloriesPerServing: string;
    macronutrients: macro[];
    vitamins: [string, number][];
    ingredients: string[];
    allergens: string[]
    options: string[];
}

//macro represents the statistics for a specific macronutrient
//name is the name of the macronutrient, grams is the mass (not necessarily grams)
//dv represents daily value, and indented represents if it's a sub-nutrient of a broader category, typically shown indented
interface macro {
    name: string
    grams: string
    dv: number
    indented: boolean
}

//scrape dining hall availability
async function scrapeHours(): Promise<ActivityData[]> {
    try {
        const html: AxiosResponse<string> = await axios.get(diningURLs[0]);
        const $ = cheerio.load(html.data);
        const activityData: ActivityData[] = [];
        $('table.hours-table tr').map((index, element) => { //for each row in the table with hours/activity level
            const name = $(element).find('span.hours-location').text();
            const activity = $(element).find('span.activity-level-box').text().trim();
            if (activity != '' && !isNaN(parseInt(activity.slice(0, -1), 10))) { //if activity level is valid integer, create ActivityLevel entry
                const activityLevel: ActivityData = {
                    name: name,
                    percentage: parseInt(activity.slice(0, -1), 10)
                };
                activityData.push(activityLevel)
            }
        })
        console.log(activityData)
        return activityData;
    } catch (error) {
        console.log(`Error fetching data from ${diningURLs[0]}:`)
        throw error;
    }
}

//scrape all menu items for specific menu from diningURLs list based on index
async function scrapeMenu(menuOption: number): Promise<MenuItem[]> {
    try {
        if (menuOption > (diningURLs).length || menuOption < 1) {
            throw new Error('Invalid menu option, please select a menu between 1-7');
        }
        const html: AxiosResponse<string> = await axios.get(diningURLs[menuOption]);
        if (html.status !== 200) {
            throw new Error(`Invalid response from ${diningURLs[menuOption]}`);
        }

        const $ = cheerio.load(html.data);
        const menuItems: MenuItem[] = [];
        const sections = $('li.sect-item').toArray();
        for (const section of sections) { // for each section of the menu
            const sectionName: string = $(section).text().split('\n')[1].trim();
            const items = $(section).find('a.recipelink').toArray();
            for (const item of items) { //for each item in this section of the menu
                const menuItem: MenuItem = {
                    name: $(item).text(),
                    section: sectionName,
                    link: String($(item).attr('href')),
                    nutrition: await scrapeNutrition(String($(item).attr('href')))
                };
                menuItems.push(menuItem);
            }
        }
        console.log(menuItems);
        return menuItems;
    }
    catch (error) {
        console.log(`Error fetching data from ${diningURLs[menuOption]}:`);
        throw error;
    }
}

async function scrapeNutrition(url: string): Promise<NutritionalInfo> {
    try {
        const html: AxiosResponse<string> = await axios.get(url);

        if (html.status !== 200) {
            throw new Error(`Error fetching data from ${url}`);
        }

        const $ = cheerio.load(html.data);

        //written out scraping logic
        //scrape serving size
        //const servingSize = $('.nfserv').text().slice(13).trim();
        //scrape calories per serving
        //const caloriesPerServing = $('.nfcal').text().slice(9).trim();
        //scrape ingredients
        //const ingredientsString = $('.ingred_allergen').find('p').first().text().slice(13);
        //const ingredients = ingredientsString.split(/\s*,\s*(?![^()]*\))/);
        //scrape allergens
        //splits ingredients by using a negative lookahead assertion to check for close paren
        //const allergens = $('.ingred_allergen > p').eq(1).text().slice(12).split(/\s*,\s*(?![^()]*\))/);
        //scrape options
        //const options = $('.prodwebcode').map((index, element) => $(element).text().trim()).get();

        //scrape vitamins
        const vitamins: [string, number][] = [];
        $('.nfvitleft, .nfvitright').map((index, element) => {
            vitamins.push([$(element).find('.nfvitname').text().trim(), parseInt($(element).find('.nfvitpct').text().trim().slice(0, -1))]);
        })

        const macros: macro[] = [];
        $('.nfnutrient').map((index, element) => {
            const dailyValue = parseInt($(element).find('.nfdvvalnum').text().trim());
            const fullText = $(element).text().split(' ');
            const name = fullText.slice(0, -2).join(' ');
            const grams = fullText.slice(-2, -1).join(' ');
            const indented = $(element).parent('.nfindent').length > 0;
            const macro: macro = {
                name: name,
                grams: grams,
                dv: dailyValue,
                indented: indented
            };
            macros.push(macro);
        })

        return {
            servingSize: $('.nfserv').text().slice(13).trim(),
            caloriesPerServing: $('.nfcal').text().slice(9).trim(),
            macronutrients: macros,
            vitamins: vitamins,
            ingredients: $('.ingred_allergen').find('p').first().text().slice(13).split(/\s*,\s*(?![^()]*\))/),
            allergens: $('.ingred_allergen > p').eq(1).text().slice(12).split(/\s*,\s*(?![^()]*\))/),
            options: $('.prodwebcode').map((index, element) => $(element).text().trim()).get()
        };
    } catch (error) {
        console.error(`Error fetching nutritional information from ${url}:`);
        throw error;
    }
}

//call desired scraping action here
//scrapeHours();
scrapeMenu(2);
