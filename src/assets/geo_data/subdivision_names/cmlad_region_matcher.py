import pandas as pd
import json

df = pd.read_csv('src/assets/geo_data/subdivision_names/Ward_to_Local_Authority_District_to_County_to_Region_to_Country_(May_2023)_Lookup_in_United_Kingdom.csv')

cols = ['LAD23NM', 'RGN23NM', 'CTRY23NM']
lad_rgn_ctry = df[cols]
clean_combos = lad_rgn_ctry.drop_duplicates().reset_index(drop=True)


unique_region = clean_combos.RGN23NM.unique()
unique_region
region_lad_dict = {}
for region in unique_region:
    lad = clean_combos.query("RGN23NM==@region").LAD23NM.values.tolist()
    region_lad_dict[region] = lad


rgn_ctry_df = clean_combos[['RGN23NM', 'CTRY23NM']].drop_duplicates()

ctry_rgn_dict = {}
for ctry in rgn_ctry_df.CTRY23NM.unique():
    rgn = rgn_ctry_df.query("CTRY23NM == @ctry").RGN23NM.values.tolist()
    ctry_rgn_dict[ctry] = rgn 


ctry_rgn_dict
with open('src/assets/geo_data/subdivision_names/ctry_rgn_relations.json', 'w') as f:
    json.dump(ctry_rgn_dict, f)

region_lad_dict
with open('src/assets/geo_data/subdivision_names/region_lad_relations.json', 'w') as f:
    json.dump(region_lad_dict, f)