import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './SearchBar.css'
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

export default function SearchBar(props) {
    const [searchByPrice, setSearchByPrice] = useState(true);
    const [searchPrice, setSearchPrice] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [numOfBedrooms, setNumOfBedrooms] = useState('');
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

 

    const handlePriceChange = (event) => {
        let formattedPrice = props.priceFormatter(event.target.value.replace(/,/g, ''));
        formattedPrice = formattedPrice.replace(/\B(?=(\d{3})+)/g, ',').replace(/£/g, '');
        setSearchPrice(formattedPrice);
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
        const mustHaveBools =Object.fromEntries(Object.keys(mustHave).map(key => {
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

        props.setPostData(data);
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

            <div className="search-type">
                <h1>Price</h1>
                <input className="checkbox" type="checkbox" id="reg-log" name="reg-log" onClick={handleSearchBy}/>
                <label htmlFor="reg-log"></label>
                <h1>Features</h1>
            </div>

            <form onSubmit={handleSubmit}>

                {searchByPrice === true
                ?  <div className='price-cont form-section col-1'>
                    <label>Price:</label>
                    <input 
                        id='priceSearch'
                        className='search-bar'
                        type="text"
                        value={searchPrice}
                        placeholder='Price'
                        onChange={handlePriceChange}
                     
                    />
                    </div>
                
                : <>
                    <div className="col-1">
                        <div className="property-type-cont form-section">
                            <label htmlFor='property-type'>Property type:</label>
                            <select name='property-type' onChange={({ target }) => setPropertyType(target.value)}>
                                <option value="none" selected disabled hidden>Select an Option</option>
                                {propertyTypes.map(type => (
                                    <option value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="beds-cont form-section col-1">
                            <label htmlFor='number-beds' >Number of beds:</label>
                            <select name='number-beds' onChange={({target}) => setNumOfBedrooms(target.value)}>
                                <option value="none" selected disabled hidden>Select an Option</option>
                                {bedFormOptions().map(opt => (

                                    <option value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                
                </>
                }
                <div className="col-2">
                    <div className="multi-select include form-section">
                            <label>Must have:</label>
                            {Object.entries(mustHave).map(feature => {
                                // console.log(feature[0]);
                                return (
                                    <button id={feature[0]} className={`${feature[0]} multi-select-label ${feature[1].include? 'active': ''}`} onClick={handleButtonClick}>{feature[1].string}</button>
                                )
                            })}
                        </div>
                        
                        <div className="multi-select dont-include form-section">
                            <label>Don't include:</label>
                            {dontShow.map(feature => (
                                <button className={`${feature} multi-select-label`}>{feature}</button>
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