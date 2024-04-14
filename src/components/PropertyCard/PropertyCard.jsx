import ImageCarousel from "../ImageCarousel/ImageCarousel";
import './PropertyCard.css'

export default function PropertyCard(props) {
    const { propertyRecord, } = props;
    const { propertyImages, city, bedrooms, bathrooms, propertySubType, summary, price } = propertyRecord;

    // displayAddress, firstVisibleDate, price.amount listingUpdate: {listingUpdateDate, listingUpdateReason}
    return (
        <>
            <div className="property-card">
                <div className="image-carousel">
                    <ImageCarousel propertyImages={propertyImages}/>
                </div>
                <div className="property-popup-header">
                    
                    <div className="city">
                        <h1>{city}</h1>
                    </div>
                    
                    <div className="price">
                        <h1>£{price.amount.toLocaleString()}</h1> 
                    </div>
                    
                    <div className="info">
                        <div className="type container">
                            <div className="emoji">🏡</div>
                            <h3>{propertySubType}</h3>
                        </div>
                        <div className="bedroom container">
                            <div className="emoji">🛌</div>
                            <h3>{bedrooms}</h3>
                        </div>
                        <div className="bathroom container">
                            <div className="emoji">🛁</div>
                            <h3>{bathrooms}</h3>
                        </div>
                    </div>
                </div>
            </div>
                   
                   
              
                {/* <div className="property-info">  
                        <div className="summary">
                            <p>{summary}</p>
                        </div>
                
                </div> */}
         
        
        </>
    )


}