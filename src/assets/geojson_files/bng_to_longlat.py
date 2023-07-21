from pyproj import Transformer
import json
import os
from collections import Counter

def bng_to_longlat2(easting, northing):
    transformer = Transformer.from_crs("EPSG:27700", "EPSG:4326")
    coords = transformer.transform(easting, northing)
    coords_clean = [round(oord, 3) for oord in coords]
    return coords_clean


def update_json(geojson):
    for i, area in enumerate(geojson['features']):
        area_coord_lists = area['geometry']['coordinates']

        # Polygon
        if len(area_coord_lists) == 1: 
            region_coords_longlat = [bng_to_longlat2(*coord) for coord in area_coord_lists[0]]
            area['geometry']['coordinates'] = region_coords_longlat
            return

        # Multipolygon
        region_coords_longlat = [[bng_to_longlat2(*coord) for coord in list[0]] for list in area_coord_lists]
        area['geometry']['coordinates'] = region_coords_longlat



with open('src/assets/geojson_files/bng/Counties_and_Unitary_Authorities_May_2023_UK_BGC_-8232673021969424694.json', 'r') as f:
    counties = json.load(f)
len(counties['features'])

update_json(counties)

with open('src/assets/geojson_files/longlat/counties_longlat.json', 'w') as f:
    json.dump(counties, f)




# with open('src/assets/geojson_files/regions_longlat.json', 'w') as f:
#     json.dump(region_coord_dict, f)

