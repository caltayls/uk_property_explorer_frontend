import pandas as pd
import json
import numpy as np


# Load csv with long name - codename relationship
msoa_names = pd.read_csv('src/assets/geo_data/subdivision_names/MSOA_codes_names.csv')
cols = ['msoa21nm', 'msoa21hclnm', 'localauthorityname']
msoa_names = msoa_names[cols]
msoa_names

# Load geojson that only has codenames
with open('src/assets/geojson_files/longlat/msoa_longlat.json', 'r') as f:
    msoa_dict = json.load(f)


# Iterate through each geojson and swap codename for long name.
for area in msoa_dict['features']:
    area_name = area['properties']['MSOA21NM'] # CMLAD
    record = msoa_names.query("msoa21nm == @area_name")
    long_name = record.msoa21hclnm.values[0]
    area['properties']['MSOA21NM'] = long_name




# Quick check it worked
random_100 = np.random.permutation(range(len(msoa_dict['features'])))[:100]
for i in random_100:
    print(msoa_dict['features'][i]['properties']['MSOA21NM'])


# Save to new json
with open('src/assets/geojson_files/longlat/msoa_longname_longlat.json', 'w') as f:
    json.dump(msoa_dict, f)




unique_auth = msoa_names.localauthorityname.unique()
cmlad_msoa_dict = {}
for auth in unique_auth:
    names = msoa_names.query("localauthorityname == @auth").msoa21hclnm.values.tolist()
    cmlad_msoa_dict[auth] = names

with open('src/assets/geo_data/subdivision_names/cmlad_msoa_relationships.json', 'w') as f:
    json.dump(cmlad_msoa_dict, f)