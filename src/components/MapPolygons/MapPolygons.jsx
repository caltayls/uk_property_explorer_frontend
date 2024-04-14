import { useState, useEffect } from "react";
import { Polygon, Tooltip  } from "react-leaflet";

import tcPolys from '../../assets/geojson_files/longlat/major_towns_and_cities_longlat.json';
import regionPolys from '../../assets/geojson_files/longlat/regions_longlat.json';
import ladInRegionPolys from '../../assets/geojson_files/longlat/lad_longlat.json';
import tcInRegionsNames from '../../assets/geo_data/subdivision_names/regions-major-towns-cities.json';
import ladInRegionNames from '../../assets/geo_data/subdivision_names/region_lad_relationships.json';

export default function MapPolygons(props) {
    const [highlightedPoly, setHighlightedPoly] = useState(''); 
    const tcsInThisRegion = tcInRegionsNames[props.region];
    const ldnBrghNames = ladInRegionNames['London'];
    const regionPoly = regionPolys['features'].find(r => r.properties.RGN22NM === props.region);

    let polysToMap;
    if (props.whatToSearch === 'London Boroughs') {
        polysToMap = {
            polys: ladInRegionPolys.features.filter(lad => ldnBrghNames.includes(lad.properties.LAD23NM)), // filter ldn polys
            name: 'LAD23NM',
        }
    } else {
        polysToMap = {
            polys: tcPolys.features.filter(tc => tcsInThisRegion.includes(tc.properties.TCITY15NM)), // filter
            name: 'TCITY15NM',
        }
    }

    return (
        <>
        <Polygon
            positions={regionPoly.geometry.coordinates} 
            pathOptions={{weight: 0.1,}}
        />
        { 
            polysToMap.polys.map((area, i) => {            
                const areaName = area.properties[polysToMap.name];
                const { coordinates } = area.geometry;
                return (
                    <Polygon 
                        key={i}
                        pathOptions={{color: 'purple', weight: 0.5, fillOpacity: highlightedPoly === areaName? 0.5: 0.2}} 
                        positions={coordinates}
                        eventHandlers={{
                            mouseover: () => setHighlightedPoly(areaName),
                            mouseout: () => setHighlightedPoly(''),
                        }}  
                    >
                        <Tooltip sticky>{areaName}</Tooltip>
                    </Polygon>
                )
                
            })
        }
        </>
    )



}