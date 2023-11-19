import sys
from bs4 import BeautifulSoup
import requests
import time 

def removePercent(str):
    if '%' in str:
        index = str.rfind(' ')
        return str[:index]
    return str
    
uclaWebs= {}
uclaWebs['d1'] = 'http://menu.dining.ucla.edu/Menus/DeNeve/Breakfast'
uclaWebs['d2'] = 'http://menu.dining.ucla.edu/Menus/DeNeve/Lunch'
uclaWebs['d3'] = 'http://menu.dining.ucla.edu/Menus/DeNeve/Dinner'

uclaWebs['b1'] = 'http://menu.dining.ucla.edu/Menus/BruinPlate/Breakfast'
uclaWebs['b2'] = 'http://menu.dining.ucla.edu/Menus/BruinPlate/Lunch'
uclaWebs['b3'] = 'http://menu.dining.ucla.edu/Menus/BruinPlate/Dinner'

uclaWebs['e3'] = 'http://menu.dining.ucla.edu/Menus/Epicuria/Dinner'
if len(sys.argv) > 2:
    print("Too many arguments, please enter one at a time")
    sys.exit(1)
if len(sys.argv) > 1:
    menu = sys.argv[1]
    if not menu in uclaWebs.keys():
        print("Not a menu")
        sys.exit(1)
else:
    print("Please enter a menu")
    sys.exit(1)

# Getting the corresponding url beased on input
url = uclaWebs[menu]
web = requests.get(url)


start = time.time()

if web.status_code == 200:
    # getting all the sections on the dining hall menu, where sections are separated by locations within the dining hall e.g. flex bar, pizzaria
    contents = BeautifulSoup(web.text, 'html.parser')
    sections = contents.find_all('li', class_='sect-item')

    # iterating through all the sections 
    for section in sections:
        # getting name of the section, and skipping Theme of the Day because its not a menu item
        sectionName = next(section.stripped_strings)
        if sectionName == 'Theme of the Day':
            continue
        print(sectionName)
        
        # finding all the menu items within the section, which just so happens to be links 
        links = section.find_all('a', class_="recipelink")
        
        # iterating through all the menu items 
        for link in links:
            # get the name of the menu item 
            print("\t", link.text.strip())

            #get and go to the link of the menu items for nutritional infor
            itemUrl = link.get('href')
            itemWeb = requests.get(itemUrl)
            if itemWeb.status_code == 200:
                # finding the tags for the menu item
                if "Further information about this item is not available at this time." in itemWeb.text:
                    print("      No additional information")
                    continue
                itemContents = BeautifulSoup(itemWeb.text, 'html.parser')
                tags= itemContents.find_all('div', class_="prodwebcode")
                for tag in tags:
                    t = next(tag.stripped_strings)
                    print("\t\t", t)

                print()
                # finding the allergies and ingredients for the menu item 
                allergySection = BeautifulSoup(str(itemContents.find_all('div', class_='ingred_allergen')),'html.parser')
                
                allergyParts = allergySection.find_all('p')
                for part in allergyParts:
                    title = str(part.find('strong'))
                    if title[8:-9] == 'INGREDIENTS:' or title[8:-9] == "ALLERGENS*:":
                        print("\t\t", part.text.strip())
                print()
                # parsing the nutrional label
                nutritionSection = BeautifulSoup(str(itemContents.find('div', class_='nfbox')),'html.parser')

                #getting the serving size
                servingSize = str(nutritionSection.find('p',class_='nfserv'))
                print("\t\t", servingSize[18:-4])
                
                print()
                # getting the number of calories
                servingCalorie = str(nutritionSection.find('p',class_='nfcal'))
                numCalories = ''
                for c in servingCalorie:
                    if c.isdigit():
                        numCalories += c
                print("\t\t Calories per Serving:", numCalories)
                print()
                # getting the macronutrients and how they breakdown
                nutrients = nutritionSection.find_all('p', class_='nfnutrient')
                for nutrient in nutrients:
                    nutrientParts = nutrient.find_all('span')
                    isMajor = False
                    
                    if 'nfmajornutrient' in str(nutrient):
                        isMajor = True
                    
                    if isMajor:
                        print('\t\t', removePercent(nutrient.text.strip()))
                    else:
                        print('\t\t\t', removePercent(nutrient.text.strip()))

                print()
                # finding all the vitamins in the nutrition label, of which the webiste have under elements nfvitleft and nfvitright
                vitaminsLeft = nutritionSection.find_all('span', class_='nfvitleft') 
                vitaminsRight = nutritionSection.find_all('span', class_='nfvitright')   

                for vitamin in vitaminsLeft:
                    print('\t\t', vitamin.text.strip().replace('\n',' ')) 
                for vitamin in vitaminsRight:
                    print('\t\t', vitamin.text.strip().replace('\n',' '))      


                    
            else:
                print("Was not able to retrieve menu item ", link.text.strip(), "'s webpage")
else:
    print("Was not able to retrieve menu page")



end = time.time()


print(end - start)

