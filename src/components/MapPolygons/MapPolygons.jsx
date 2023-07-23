import { useState, useEffect } from "react";
import { Polygon, Tooltip } from "react-leaflet";
import districtsJson from '../../assets/geojson_files/longlat/districts_longlat.json';
import regionAndDist from '../../assets/geo_data/subdivision_names/regions-districts.json';

export default function MapPolygons({region}) {
    const [highlightedPoly, setHighlightedPoly] = useState(''); 
    const districtsInRegion = regionAndDist[region];



    return (
    districtsJson.features.map((area, i) => {
                       
        const areaName = area.properties.LAD23NM;
        if (districtsInRegion && districtsInRegion.includes(areaName)) {
 
 
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
            }

    })
    )



}