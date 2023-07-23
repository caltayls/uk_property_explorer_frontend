import requests
from bs4 import BeautifulSoup
import pandas as pd
import json

response = requests.get('https://www.visitnorthwest.com/counties/', headers={
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0'
})
soup = BeautifulSoup(response.text, 'html.parser')
table = soup.select('table')[0]

subdivision_data = {
    'county': [county.text for county in table.select('td.column-1')],
    'region': [region.text for region in table.select('td.column-2')],
    'city': [city.text for city in table.select('td.column-5')],
}
df = pd.DataFrame(subdivision_data)
df
unqiue_regions = df.region[~df.region.str.contains('/')].unique()
region_names = {'regionNames': unqiue_regions.tolist()}
with open('src/assets/region_names.json', 'w') as f:
    json.dump(region_names, f)

# with open('src/assets/geojson_files/longlat/counties_longlat.json', 'r') as f:
#     county_uni = json.load(f) 

# county_uni['features'].__len__()