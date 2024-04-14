import { useEffect, useState, useCallback } from 'react';
// import jsonData from '../../assets/react_test_data.json';
// import featureSearch from '../../assets/feature_search.json';
// import jsonSummary from '../../assets/top_vals.json';
import './App.css';
import Map from '../Map/Map.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import Table from '../Table/Table';
import ClipLoader from "react-spinners/ClipLoader";
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
// import data from '../../assets/test_data/test_response.json';



function App() {
  // state used for loading data from backend
  const [getParams, setGetParams] = useState('');
  const [searchType, setSearchType] = useState('');
  const [mapData, setMapData] = useState('');
  const [summaryData, setSummaryData] = useState('');
  const [region, setRegion] = useState('');
  const [whatToSearch, setWhatToSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // state for table values to colour map
  const heatMap = {};
  if (summaryData) {
    const meanValueArray = summaryData.map((rec) => Number(rec.mean));
    const tableLength = meanValueArray.length;
    const maxValue = Math.max(...meanValueArray);
    const minValue = Math.min(...meanValueArray);
    heatMap.tableLength = tableLength;
    heatMap.maxValue = maxValue;
    heatMap.minValue = minValue;
  }
  


  const fetchResponse = async () => {
    if (getParams) {
      console.log(getParams);
      await axios.post('http://localhost:8000/', { params: getParams })
        .then(response => {
          const data = response.data;
          setMapData(data.properties);
          setSummaryData(data.summaryTable)
        })
        .catch(e => {
          console.log(e);
          setIsLoading(false);
        });
      setIsLoading(false);
    }
  };
  
  useEffect (() => {
    fetchResponse()
  }, [getParams]);




  return (
    <>

      <div className="searchBar-container">
        <SearchBar setIsLoading={setIsLoading} setGetParams={setGetParams}/>
      </div>
      {mapData && (
        <div className="map-table-container">
        <div className="summary-table-container">
          <Table 
            summaryData={summaryData}
            getParams={getParams}
          />
        </div>
        <div className="map-container">
          <Map 
            className='map'
            mapData={mapData}
            region={region}
            whatToSearch={whatToSearch}
          />          
        </div> 
      </div>
      )}
      
      

      
    </>
  )
}

export default App;
