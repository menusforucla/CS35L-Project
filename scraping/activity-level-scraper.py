import requests
from datetime import datetime
from bs4 import BeautifulSoup


# get dining hall data from either website or test html

# for testing with dining website
hoursURL = "http://menu.dining.ucla.edu/Hours"
page = requests.get(hoursURL)
soup = BeautifulSoup(page.text, 'html.parser')

# for testing with HTML file
#with open('activity-data/study-example.html') as file:
 #   html=file.read()
#soup = BeautifulSoup(html, 'html.parser')


#parse dining hall data with beautifulsoup library
activity_data = [] # initialize data list, which will contain tuples for each dining location with an activity-level indicator

rows = soup.find('table', {'class': 'hours-table'}).find_all('tr') # find table with rows of dining data, where each row is for a specific dining location
for row in rows:
    name = row.find('span', {'class':'hours-location'}) # name of row
    time = row.find('span', {'class':'activity-level-box'}) # attempt to find span with activity-level data
    if time is not None: # if span exists, extract and save data
        activity_level = (name.text, int(time.text.strip()[:-1])) # str, inavailable for timet
        activity_data.append(activity_level)

#for data in activity_data: # print collected activity data
 #   print(data) # str, int, datetime.datetime


# get current time
current_time_str = datetime.now().strftime("%Y-%m-%d-%H-%M")

# save parsed data to file as JSON
data_file=open("activity-data/" + current_time_str + ".json", "w")
data_file.write("[\n")
for data in activity_data[:-1]:
    data_file.write("{\"name\":\"%s\", \"percentage\":\"%d\"},\n" % data)
if (len(activity_data) != 0):
    data_file.write("{\"name\":\"%s\", \"percentage\":\"%d\"}\n" % activity_data[-1])
else:
    print("No Dining Activity Level data currently available")
data_file.write("]")
data_file.close()

print("Dining Activity Level data successfully parsed for time: ", current_time_str) # print success message
