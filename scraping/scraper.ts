//imports
import * as cheerio from 'cheerio';
import { default as axios } from 'axios';
import { AxiosResponse } from 'axios';
import * as fs from 'fs';

//dining urls
let diningURLs: string[] = [
    'http://menu.dining.ucla.edu/Hours',
    'http://menu.dining.ucla.edu/Menus/DeNeve/Breakfast',
    'http://menu.dining.ucla.edu/Menus/DeNeve/Lunch',
    'http://menu.dining.ucla.edu/Menus/DeNeve/Dinner',
    'http://menu.dining.ucla.edu/Menus/BruinPlate/Breakfast',
    'http://menu.dining.ucla.edu/Menus/BruinPlate/Lunch',
    'http://menu.dining.ucla.edu/Menus/BruinPlate/Dinner',
    'http://menu.dining.ucla.edu/Menus/Epicuria/Dinner'
];

interface ActivityData {
    name: string
    percentage: number
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
    macronutrients: string[];
    vitamins: string[];
    ingredients: string[];
    options: string[];
}

//scrape dining hall availability
async function scrapeHours(): Promise<void> {
    try {
        axios.get(diningURLs[0])
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const activityData: ActivityData[] = [];
                $('table.hours-table tr').each((index, element) => {
                    const name = $(element).find('span.hours-location').text();
                    const activity = $(element).find('span.activity-level-box').text().trim();
                    if (activity != '' && !isNaN(Number(activity.slice(0, -1)))) {
                        const activityLevel: ActivityData = {
                            name: name,
                            percentage: parseInt(activity.slice(0, -1), 10)
                        };
                        activityData.push(activityLevel)
                    }
                })
                console.log(activityData)
            });
    } catch (error) {
        console.log(`Error fetching data from ${diningURLs[0]}: ${error.message}`)
    }
}

async function scrapeMenu(menuOption: number): Promise<void> {
    try {
        const html: AxiosResponse<string> = await axios.get(diningURLs[menuOption]);
        if (html.status !== 200) {
            throw new Error(`Error fetching data from ${diningURLs[menuOption]}`);
        }

        const $ = cheerio.load(html.data);
        const menuItems: MenuItem[] = [];
        const sections = $('li.sect-item').toArray();
        for (const section of sections) { // for each section
            const sectionName: string = $(section).text().split('\n')[1].trim();
            const items = $(section).find('a.recipelink').toArray();
            for (const item of items) {
                const menuItem: MenuItem = {
                    name: $(item).text(),
                    section: sectionName,
                    link: String($(item).attr('href')),
                    nutrition: await nutritionScraper(String($(item).attr('href')))
                };
                menuItems.push(menuItem);
            }
        }

        for (const item of menuItems) {
        //    console.log(item);
        }

    }
    catch (error) {
        console.log(`Error fetching data from ${diningURLs[menuOption]}: ${error.message}`);
    }
}

async function nutritionScraper(url: string): Promise<NutritionalInfo> {
    try {
        const html: AxiosResponse<string> = await axios.get(url);

        if (html.status !== 200) {
            throw new Error(`Error fetching data from ${url}`);
        }

        const $ = cheerio.load(html.data);

        //scrape ingredients
        const ingredients = [];
        const ingredientsString = $('.ingred_allergen').find('p').first().text().slice(13);
       // console.log(ingredientsString.split('/,\s*(?![^()]*\))/'));

        //scrape options
        const options = [];
        $('.prodwebcode').each((index,element) => {
            console.log(element.text());
        })
        



        const nutrition: NutritionalInfo = {
            servingSize: "-1",
            caloriesPerServing: "-1",
            macronutrients: [""],
            vitamins: [""],
            ingredients: [""],
            options: [""]
        };
        return nutrition;
    } catch (error) {
        console.error(`Error fetching nutritional information from ${url}: ${error.message}`);
        throw error;
    }
}


//scrapeHours();
scrapeMenu(1)



//checking for completion

