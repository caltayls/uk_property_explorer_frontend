import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-cluster";
import PropertyCard from '../PropertyCard/PropertyCard';
import MapPolygons from '../MapPolygons/MapPolygons.jsx';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import regionsJson from '../../assets/geojson_files/longlat/regions_longlat.json';

// animate map panning
function Fly ({ coords }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(coords, 8);
    }, [coords]);
};



export default function Map(props) {

    const { mapData, region, whatToSearch, meanMinMax } = props;
    const [zoom, setZoom] = useState(6);
    const [hideMapIcons, setHideMapIcons] = useState(false);
    
    
    const divisionTypeJsonNames = {
        Countries: {outer: 'CTRY22NM', inner: 'RGN22NM'}, 
        Regions: {outer: 'RGN22NM', inner: 'LAD23NM'},
        'Local Authority Districts within a Region':  {outer: 'LAD23NM', inner: 'MSOA21NM'},
    }
    // # area_name = area['properties']['LAD23NM'] # LAD
    // # area_name = area['properties']['RGN22NM'] # Region
    // # area_name = area['properties']['CTRY22NM'] # Country
    // # area_name = area['properties']['MSOA21NM'] # MSOA - need to convert into actual names

    'Countries', 'Regions', 'Local Authority Districts within a Region'
    
    let regionJson, coords;
    if (region) {
        regionJson = regionsJson['features'].find(reg => String(reg['properties']['RGN22NM']) === String(region));
        coords = [regionJson['properties']['LAT'], regionJson['properties']['LONG']];

    }




    // returns a specified number of records to display on map
    const filterData = (array, numOfRecordsPerRegion) => {
        const filteredArray = [];
        const cityCount = {};
        array.forEach(propRecord => {
            const city = propRecord.city;
            if (cityCount[city]) {
                if (cityCount[city] < numOfRecordsPerRegion) {
                    filteredArray.push(propRecord);
                    cityCount[city]++;
                }
            } else {
                cityCount[city] = 1;
                filteredArray.push(propRecord);
            }   
        })
        return filteredArray
    }; 
    const recordsForMap = filterData(mapData, 10);

    const handleHideIcons = () => {
        setHideMapIcons(prev => !prev);
    };

    return (
        <>
        <div className="hide-icons-container">
            <p>Hide Icons</p>
            <input className="checkbox" type="checkbox" name="hide-icons" id="hide-icons" onClick={handleHideIcons}/>
            <label htmlFor="hide-icons"></label>
        </div>
        <MapContainer className='property-map' center={[55,0]} zoom={zoom}>
            {region && <Fly coords={coords}/>}
            <TileLayer
                attribution={'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}
                url={'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png'}
            />
            <MarkerClusterGroup maxClusterRadius={20}>
                {!hideMapIcons && mapData && recordsForMap.map(record => {
                    const { location } = record;
                    return (
                        <Marker position={[location.latitude, location.longitude]}>
                            <Popup 
                                className='property-popup' 
                                autoPanPadding={[100,40]}
                            >                        
                                <PropertyCard propertyRecord={record}/>
                            </Popup>
                        </Marker>
                    )
                })}
            </MarkerClusterGroup>
        
            <MapPolygons region={region} whatToSearch={whatToSearch} meanMinMax={meanMinMax}/>
        </MapContainer>
        </>
    );
};












  // Finds the mid point of properties belonging to a specific region
    // const avgLocation = (recordsForMap) => {
    //     const avgLocation = {};
    //     const locations = {};
    //     const cities = [];
    //     recordsForMap.forEach(record => {

    //         const city = record.city;
    //         const { latitude, longitude } = record.location;

    //         if (locations[city]) {
    //             locations[city].latitude.push(latitude);
    //             locations[city].longitude.push(longitude);
    //         } else {
    //             locations[city] = {
    //                 latitude: [latitude],
    //                 longitude: [longitude],
    //             };
    //             cities.push(city);
    //         }
    //     });
       
    //     cities.forEach(city => {
    //         const longitudeArray = locations[city].longitude;
    //         const latitudeArray = locations[city].latitude;

    //         const avgLongitude = longitudeArray.reduce((acc, curr) => acc + curr ) / longitudeArray.length;
    //         const avgLatitude = latitudeArray.reduce((acc, curr) => acc + curr ) / latitudeArray.length;
    //         avgLocation[city] = {
    //             longitude: avgLongitude,
    //             latitude: avgLatitude,
    //         }
    //     });

    //     return avgLocation;
    // };

    // generate starting position when map mounts
    // const findMapCenter = (locations) => {
    //     const lats = [];
    //     const longs = [];
    //     Object.values(regionAvgLocation).forEach(coord => {
    //         lats.push(coord.latitude);
    //         longs.push(coord.longitude);
    //     });
    //     const center = {
    //         latitude: longs.reduce((acc, curr) => acc + curr ) / longs.length,
    //         longitude: lats.reduce((acc, curr) => acc + curr ) / lats.length
    //     };
        
    //     return [center.longitude, center.latitude];
    // }




    // if (mapData) {
        // console.log(mapData);
        

    //     console.log(recordsForMap);
    //     const regionAvgLocation = avgLocation(recordsForMap);
    //     const mapCenter = findMapCenter(regionAvgLocation);
    // // }

    