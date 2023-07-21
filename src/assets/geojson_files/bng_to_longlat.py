from pyproj import Transformer
import numpy as np
import json
import os
from functools import lru_cache

# Convert ONS geojson files from BNG coordinate system to longlat.



class CoordinateTransformer:
    def __init__(self):

        self.transformer = Transformer.from_crs(27700, 4326)

    def bng_to_longlat3(self, east, north):
        coords = self.transformer.transform(east, north)
        return coords


    def convert_coords(self, geojson):
        for i, area in enumerate(geojson['features']):
            geometry_type = area['geometry']['type']
            area_name = area['properties']['CTYUA23NM']
            area_coord_lists = area['geometry']['coordinates']
            if area_name == 'Swansea':
                print(area_name)
            
            longlat_coord_lists = []
            for lst in area_coord_lists:
                if geometry_type == 'MultiPolygon':
                    lst = lst[0]
                longlat_lst = [self.bng_to_longlat3(*coords) for coords in lst]
                longlat_lst_clean = np.around(longlat_lst, 3).tolist()
                longlat_coord_lists.append(longlat_lst_clean)
            area['geometry']['coordinates'] = longlat_coord_lists


    def create_longlat_json(self, bng_file_name, longlat_file_name):
        bng_dir_path = 'src/assets/geojson_files/bng/'
        longlat_dir_path = 'src/assets/geojson_files/longlat/'
        bng_path = bng_dir_path + bng_file_name
        longlat_path = longlat_dir_path + longlat_file_name
        
        with open(bng_path, 'r') as f:
            geojson_dict = json.load(f)

        self.convert_coords(geojson_dict)

        # with open(longlat_path, 'w') as f:
        #     json.dump(geojson_dict, f)



transformer = CoordinateTransformer()


# Create longlat counties geojson
county_bng_name = 'Counties_and_Unitary_Authorities_May_2023_UK_BGC_-8232673021969424694.json'
county_longlat_name = 'counties.json'
transformer.create_longlat_json(county_bng_name, county_longlat_name)

# Create longlat wards geojson
ward_bng_name = 'Wards_December_2022_Boundaries_GB_BSC_-130606180342914343.json'
ward_longlat_name = 'wards.json'
transformer.create_longlat_json(ward_bng_name, ward_longlat_name)




with open('src/assets/geojson_files/bng/Wards_December_2022_Boundaries_GB_BSC_-130606180342914343.json', 'r') as f:
    geojson_dict = json.load(f)

geojson_dict['features'][0]
# WD22NM - ward name
# LAD22CD - district name