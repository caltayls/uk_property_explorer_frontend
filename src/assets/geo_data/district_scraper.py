import requests
from bs4 import BeautifulSoup
import pandas as pd
import json

response = requests.get('https://en.wikipedia.org/wiki/List_of_English_districts_by_population', headers={
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0'
})
soup = BeautifulSoup(response.text, 'html.parser')
table = soup.select('table')[0]


subdivision_data = {
    'district': [district.text for district in table.select('tr > td:nth-child(2) > a')],
    'region': [region.text for region in table.select('tr > td:nth-child(6) > a')],    
}

df = pd.DataFrame(subdivision_data)

unique_region = df.region.unique()
region_dist_dict = {}
for region in unique_region:
    districts = df.query("region==@region").district.values.tolist()
    region_dist_dict[region] = districts


with open('src/assets/geo_data/subdivision_names/regions-districts.json', 'w') as f:
    json.dump(region_dist_dict, f)



# https://www.londoncouncils.gov.uk/who-runs-london/general-election/constituencies-and-boroughs
# ldn consts in boroughs