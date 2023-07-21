import { useEffect, useState } from 'react';
import jsonData from '../../assets/react_test_data.json';
import featureSearch from '../../assets/feature_search.json';
import jsonSummary from '../../assets/top_vals.json';
import './App.css';
import Map from '../Map/Map.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import Table from '../Table/Table';
import ClipLoader from "react-spinners/ClipLoader";
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import data from '../../assets/test_response.json';



function App() {
  const fakePrice = 300000;
  const [postData, setPostData] = useState('');
  // const [mapData, setMapData] = useState(data.properties);
  // const [summaryData, setSummaryData] = useState(data.summaryTable);
  const [mapData, setMapData] = useState('');
  const [summaryData, setSummaryData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchResponse = async () => {
    if (postData) {
      const response = await axios.post('http://localhost:8000/price_search/search/', postData)
        .then(response => {
          const data = response.data;
          console.log(data);
          setMapData(data.properties);
          setSummaryData(data.summaryTable);
          setIsLoading(false);
        })
      }
    };
  

  useEffect (() => {
    fetchResponse()
  }, [postData]);



  return (
    <>

      <div className="searchBar-container">
        <SearchBar setIsLoading={setIsLoading} setPostData={setPostData}/>
      </div>
      <div className="map-table-container">
        <div className="summary-table-container">
            <Table 
              summaryData={summaryData}
              price={fakePrice}
            />
        </div>
        <div className="map-container">
          {
            (isLoading)
            ? (
              <div className="loader-cont">
                  <ClipLoader 
                    className='loader' 
                    color="#6cbbf0" 
                    speedMultiplier='0.8'
                  />
              </div>
            )
            : (
                <Map 
                  className='map'
                  mapData={mapData}
              />
            )
          }
          </div> 
         
      </div>
      

      
    </>
  )
}

export default App;
