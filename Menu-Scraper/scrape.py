import sys
from bs4 import BeautifulSoup
import requests
import time 


    
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

url = uclaWebs[menu]
web = requests.get(url)


start = time.time()

if web.status_code == 200:
    contents = BeautifulSoup(web.text, 'html.parser')
    sections = contents.find_all('li', class_='sect-item')

    
    for section in sections:
        sectionName = next(section.stripped_strings)
        print(sectionName)
        
        links = section.find_all('a', class_="recipelink")
        
        for link in links:
            print(" ", link.text.strip())

end = time.time()

print(end - start)