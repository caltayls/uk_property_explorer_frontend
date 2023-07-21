import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip} from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-cluster";
import PropertyCard from '../PropertyCard/PropertyCard';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import geoJson from '../../../regions_longlat.json';



export default function Map(props) {
    const { mapData } = props;
    const [zoom, setZoom] = useState(6);

    // returns a specified number of records to display on map
    const filterData = (array, numOfRecordsPerRegion) => {
        const filteredArray = [];
        const cityCount = {};

        for (let i=0; i < array.length; i++) {
            
            const propRecord = array[i];  
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
        }
        return filteredArray
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
        const recordsForMap = filterData(mapData, 10);
        console.log(recordsForMap);
    //     console.log(recordsForMap);
    //     const regionAvgLocation = avgLocation(recordsForMap);
    //     const mapCenter = findMapCenter(regionAvgLocation);
    // // }

    
    
   
 

    return (
        <>
        <MapContainer className='property-map' center={mapData? [50,0]: [55,0]} zoom={zoom}>
            <TileLayer
        attribution={
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          }
          url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
            />
            <MarkerClusterGroup
                maxClusterRadius={20}
            >
                {mapData && recordsForMap.map(record => {
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
            
            {Object.keys(geoJson).map(key => {
                const regionName = key;
                // console.log(key)
                const multiPoly = geoJson[key];
                return (
                    <Polygon pathOptions={{ color: 'purple' }} positions={multiPoly}>
                        <Tooltip sticky>{regionName}</Tooltip>
                    </Polygon>
                )

            })}
            </MapContainer>
        </>
    );
};