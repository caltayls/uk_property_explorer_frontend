import json
import shapely 
import numpy as np

# tag each town/city with its parent region
# find centre point of each town/city then see if it lies within a region's borders

# Create a dict containing centre point of each town/city
with open('src/assets/geojson_files/bng/Major_Towns_and_Cities_Dec_2015_Boundaries_V2_2022.json', 'r') as f:
    towns_cities = json.load(f)

tc_array = towns_cities['features']
tc_array[0]['properties']
tc_cp_dict = { 
    tc['properties']['TCITY15NM']: [
         tc['properties']['LAT'],
         tc['properties']['LONG'],
    ]
    for tc in tc_array
}


# Load regions into an array
with open('src/assets/geojson_files/longlat/regions_longlat.json', 'r') as f:
    regions = json.load(f)
for region in regions['features']:
    print(region['properties']['RGN22NM'])

region_array = regions['features']
print(len(region_array))

# Add Wales and Scotland to region array
with open('src/assets/geojson_files/longlat/countries_longlat.json', 'r') as f:
    countries = json.load(f)
not_eng = []
for country in countries['features']:
    name = country['properties']['CTRY22NM'] 
    if name != 'England':
        not_eng.append(country)

region_array.extend(not_eng)


# Iterate through each region poly and see if towns/cities are positioned within.
# Create a dict with region nm as key and an array of its towns/cities.
region_town_dict = {}
for region in region_array:
    
    try:
        region_name = region['properties']['RGN22NM']
    except: 
        region_name = region['properties']['CTRY22NM'] # deals with Wales/Scot
    region_town_dict[region_name] = []
    region_poly = region['geometry']['coordinates']
    region_poly_type = region['geometry']['type']
    
    # Get largest array when MultiPolygon
    if region_poly_type == 'MultiPolygon':
        idx_largest = np.argmax([len(poly) for poly in region_poly])
        largest_poly = region_poly[idx_largest]
        region_poly = largest_poly
    else:
        region_poly = region_poly[0]
    
    region_line_string = shapely.Polygon(region_poly)
 
    for name, coords in tc_cp_dict.items():
        cp = shapely.Point(coords)
        if region_line_string.contains(cp):
            region_town_dict[region_name].append(name)

 

with open('src/assets/geo_data/subdivision_names/regions-major-towns-cities.json', 'w') as f:
    json.dump(region_town_dict, f)


for key, val in region_town_dict.items():
    print(len(val))