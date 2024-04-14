import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './SearchBar.css'
import { useEffect, useState, useCallback } from 'react';
import regionAndTc from '../../assets/geo_data/subdivision_names/regions-major-towns-cities.json';



export default function SearchBar(props) {
    const [searchByPrice, setSearchByPrice] = useState(true);
    const [searchPrice, setSearchPrice] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [numOfBedrooms, setNumOfBedrooms] = useState('');

    const [whatToSearch, SetWhatToSearch] = useState('');
    const [region, setRegion] = useState('');


    const [mustHave, setMustHave] = useState({
        garden: {
            include: false,
            string: 'Garden'
        },
        newHome: {
            include: false,
            string: 'New Home'
        },
        parking: {
            include: false,
            string: 'Parking'
        },
        retirementHome: {
            include: false,
            string: 'Retirement Home'
        },
    });
   
    const whatToSearchOptions = ['Major towns and cities within a region', 'London Boroughs']
    // const subdivisionTypeChoices = ['Countries', 'Regions', 'Local Authority Districts within a Region'];
    const regionNames = Object.keys(regionAndTc);



    const handlePriceChange = ({target}) => {
        setSearchPrice(target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    };

    const toggleInclude = (key) => {
        setMustHave(prev => (
            {...prev,
                [key]: {
                    ...prev[key],
                    include: !prev[key].include
                }
            }
        ))
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        const id = e.target.id;
        console.log(id);
        toggleInclude(id)
    };

    const handleSearchBy = () => {
        setSearchByPrice(prev => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        props.setIsLoading(true);
        // Remove string entries from mustHave obj
        const mustHaveBools = Object.fromEntries(Object.keys(mustHave).map(key => {
            const {include, ...rest} = mustHave[key];
            return [key, include];
        }));
        let data = {
            searchType: searchByPrice? 'price': 'features',
            mustHave: mustHaveBools, 
        };
        if (data.searchType === 'price') {
            data.price = searchPrice.replace(/\D+/g, '');
        } else {
            data.numOfBedrooms = numOfBedrooms; 
            data.propertyType = propertyType;
        }
        
        
        data.whatToSearch = whatToSearch;
        data['region'] = whatToSearch === 'London Boroughs'? 'London': region;
         
        props.setGetParams(data);
    };


    const propertyTypes = ['Detached', 'Semi-detached', 'Terraced', 'Flat', 'Bungalow', 'Park-Home'];
    const dontShow = ['New Home', 'Retirement Home']; // always have buying schemes in url
    const bedFormOptions = () => {
        const options =['Studio'];
        for (let i=1; i<11; i++) {
            options.push(i);
        }
        return options;   
    };


    return (
        <div className='search-container'>

            <form onSubmit={handleSubmit}>
                <div className="whatToSearch">
                    <label htmlFor='whatToSearch' >Where to search</label>
                    <select name='whatToSearch' onChange={({target}) => SetWhatToSearch(target.value)}>
                        <option value="none" selected disabled hidden>Select an Option</option>
                        {whatToSearchOptions.map(opt => <option value={opt}>{opt}</option>)}
                    </select>
                </div>

                {whatToSearch === 'Major towns and cities within a region'
                ? (                 
                <div className="regionChoice">
                <label htmlFor='regionChoice' >Region</label>
                <select name='regionChoice' onChange={({target}) => setRegion(target.value)}>
                    <option value="none" selected disabled hidden>Select a Region</option>
                    {regionNames.map(opt => <option value={opt}>{opt}</option>)}
                </select>
                </div>)
                : null
                }

                <div className="search-type">
                    <span className='search-type-choice price'>Price</span>
                    
                    <label className='toggle'>
                        <input className="checkbox" type="checkbox" id="reg-log" name="reg-log" onClick={handleSearchBy}/>
                        <span className='slider'></span>
                    </label>
                    <span className='search-type-choice features'>Features</span>
                </div>
                

                {searchByPrice === true
                ? <div className='price-cont form-section col-1'>
                    <label>Price:</label>
                    <input 
                        id='priceSearch'
                        className='search-bar'
                        type="text"
                        value={searchPrice}
                        placeholder='£ XXX XXX'
                        onChange={handlePriceChange}
                        autoComplete="off"
                    
                    />
                </div>
                : <div className="col-1">
                    <div className="property-type-cont form-section">
                        <label htmlFor='property-type'>Property type:</label>
                        <select name='property-type' onChange={({ target }) => setPropertyType(target.value)}>
                            <option value="none" selected disabled hidden>Select an Option</option>
                            {propertyTypes.map(type => <option value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div className="beds-cont form-section col-1">
                        <label htmlFor='number-beds' >Number of beds:</label>
                        <select name='number-beds' onChange={({target}) => setNumOfBedrooms(target.value)}>
                            <option value="none" selected disabled hidden>Select an Option</option>
                            {bedFormOptions().map(opt => <option value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </div>
                }

                <div className="col-2">
                    <div className="multi-select include form-section">
                        <label>Must have:</label>
                        {Object.entries(mustHave).map(feature => (                            
                            <button 
                                id={feature[0]} 
                                className={`${feature[0]} multi-select-label ${feature[1].include? 'active': ''}`} 
                                onClick={handleButtonClick}
                            >
                                {feature[1].string}
                            </button>
                        ))}
                    </div>      
                   
                </div>
                <div className="search-button-container form-section row-2">
                    <button className='submit-button' type='submit'>Search</button>
                </div> 
            </form>
        </div>
    );
};