from pyproj import Transformer
import numpy as np
import json

### think this returns array with lon lat wrong way round. 
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
            # area_name = area['properties']['cmlad11nm'] # CMLAD
            # area_name = area['properties']['RGN22NM'] # Region
            # area_name = area['properties']['CTRY22NM'] # Country
            # area_name = area['properties']['MSOA21NM'] # MSOA - need to convert into actual names
            area_coord_lists = area['geometry']['coordinates']
            
             
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

        with open(longlat_path, 'w') as f:
            json.dump(geojson_dict, f)



transformer = CoordinateTransformer()


# Countries
# country_bng_name = 'Countries_December_2022_GB_BGC.json'
# country_longlat_name = 'countries_longlat.json'
# transformer.create_longlat_json(country_bng_name, country_longlat_name)

# # LAD
# lad_bng_name = 'Local_Authority_Districts_May_2023_UK_BGC.json'
# lad_longlat_name = 'lad_longlat.json'
# transformer.create_longlat_json(lad_bng_name, lad_longlat_name)

# MSOA
# msoa_bng_name = 'MSOA_2021.json'
# msoa_longlat_name = 'msoa_longlat.json'
# transformer.create_longlat_json(msoa_bng_name, msoa_longlat_name )

# # Regions
# reg_bng_name = 'Regions_coarse.json'
# reg_longlat_name = 'regions_longlat.json'
# transformer.create_longlat_json(reg_bng_name, reg_longlat_name )


# Towns/Cities
reg_bng_name = 'Major_Towns_and_Cities_Dec_2015_Boundaries_V2_2022.json'
reg_longlat_name = 'major_towns_and_cities_longlat.json'
transformer.create_longlat_json(reg_bng_name, reg_longlat_name )



# with open('src/assets/geojson_files/bng/Wards_December_2022_Boundaries_GB_BSC_-130606180342914343.json', 'r') as f:
#     geojson_dict = json.load(f)

# districts = [ward['properties']['LAD22NM'] for ward in geojson_dict['features']]

# unique_districts = [*set(districts)]
# district_name_dict = {'names': unique_districts}
# with open('src/assets/geojson_files/district_names.json', 'w') as f:
#     json.dump(district_name_dict, f)
# Ward data 
# WD22NM - ward name
# LAD22NM - district name