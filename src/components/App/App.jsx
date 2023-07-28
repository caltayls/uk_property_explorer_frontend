import { useEffect, useState } from 'react';
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

  const [postData, setPostData] = useState('');
  const [searchType, setSearchType] = useState('');
  const [mapData, setMapData] = useState('');
  const [summaryData, setSummaryData] = useState('');
  const [region, setRegion] = useState('');
  const [whatToSearch, setWhatToSearch] = useState('');
  const [searchPrice, setSearchPrice] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const fetchResponse = async () => {
    if (postData) {
      console.log('wooooooooooooo');
      setIsLoading(true);
      setRegion(postData.region);
      setWhatToSearch(postData.whatToSearch);
      setSearchType(postData.searchType);
      await axios.post('http://localhost:8000/search/search/', postData)
        .then(response => {
          const data = response.data;
          console.log(data);
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
  }, [postData]);

console.log(postData);
console.log(searchType);

  return (
    <>

      <div className="searchBar-container">
        <SearchBar setIsLoading={setIsLoading} setPostData={setPostData}/>
      </div>
      {mapData && (
        <div className="map-table-container">
        <div className="summary-table-container">
          <Table 
            summaryData={summaryData}
            postData={postData}
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
