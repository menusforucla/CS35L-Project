import requests
import re
from datetime import datetime
from bs4 import BeautifulSoup


# get dining hall data
# for testing with dining website
#hoursURL = "http://menu.dining.ucla.edu/Hours"
#page = requests.get(hoursURL)
#soup = BeautifulSoup(page.text, 'html.parser')

# for testing with HTML file
with open('study-example.html') as file:
    html=file.read()


# parse dining hall data with beautifulsoup library
soup = BeautifulSoup(html, 'html.parser')

table = soup.find('table', {'class': 'hours-table'}) # find table with rows of dining data
#print(table)

activity_data = []

rows = table.find_all('tr') # each row is for a specific dining location
for row in rows:
    name = row.find('span', {'class':'hours-location'}) # name of row
    time = row.find('span', {'class':'activity-level-box'}) # attempt to find span with activity-level data
    if time is not None: # if span exists, extract and save data
        activity_level = (name.text, int(time.text.strip()[:-1])) # str, int
        activity_data.append(activity_level)

#for data in activity_data: # print collected activity data
#    print(data) # str, int, datetime.datetime


# get current time
current_time = datetime.now()
current_time_str = current_time.strftime("%Y-%m-%d-%H-%M")
print(current_time_str)

# save parsed data to file as JSON
data_file=open(current_time_str+".json", "w")
data_file.write("[\n")
for data in activity_data[:-1]:
    data_file.write("{\"name\":\"%s\", \"percentage\":\"%d\"},\n" % data)

data_file.write("{\"name\":\"%s\", \"percentage\":\"%d\"}\n" % activity_data[-1])
data_file.write("]")
data_file.close()
