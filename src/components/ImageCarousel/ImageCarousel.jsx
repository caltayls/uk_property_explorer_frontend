import { useState, useEffect } from 'react';
import './ImageCarousel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function ImageCarousel({ propertyImages }) {
    const [index, setIndex] = useState(0);
    const [images, setImages] = useState(propertyImages.images);
  
    
    const nextImage = () => {
        setIndex(prevIndex => (
            prevIndex === images.length - 1? 0: prevIndex + 1
        ));
    }
    const previousImage = () => {
        setIndex(prevIndex => (
            prevIndex === 0? images.length - 1: prevIndex - 1
        ));
    }

    
    return (
        <>
        <div className="carousel">

            <img 
                src={images[index].srcUrl}
                alt={images[index].caption}
            />
        </div>

        <button className='button left' onClick={previousImage}><FontAwesomeIcon icon={faArrowLeft} /></button>
        <button className='button right' onClick={nextImage}><FontAwesomeIcon icon={faArrowRight}/></button>

        <div className="photo-num">
            <p>{index + 1} of {images.length}</p>
        </div>
        </>
    )
    


}
