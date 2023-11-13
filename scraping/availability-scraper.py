import requests
import re
from datetime import datetime
from bs4 import BeautifulSoup

# for testing with dining website
#hoursURL = "http://menu.dining.ucla.edu/Hours"
#page = requests.get(hoursURL)
#soup = BeautifulSoup(page.text, 'html.parser')

# for testing with HTML file
with open('study-example.html') as file:
    html=file.read()

soup = BeautifulSoup(html, 'html.parser')

table = soup.find('table', {'class': 'hours-table'})
#print(table)

activity_data = []

rows = table.find_all('tr')
for row in rows:
    name = row.find('span', {'class':'hours-location'})
    time = row.find('span', {'class':'activity-level-box'})
    if time is not None:
        activity_level = (name.text, int(time.text.strip()[:-1]), datetime.now()) # str, int, datetime
        activity_data.append(activity_level)

for data in activity_data:
    print(data) # str, int, datetime.datetime