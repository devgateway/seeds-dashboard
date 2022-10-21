import { ButtonBack, ButtonNext, CarouselContext, CarouselProvider, Slide, Slider } from "pure-react-carousel";
import React, { useContext, useEffect, useState } from "react";
import { ADDITIONAL_COUNTRIES } from "./CountryFilter";
import { Icon } from "semantic-ui-react";
import { VISIBLE_COUNTRIES } from "../reducers/StoreConstants";


const CountryCarousel = ({ countries, selectedCountry, setVisibleCountries }) => {
    const applyVisibleCountries = () => {
        if (countries) {
            const visibleCountries = countries
                .filter(c => c.countryId !== selectedCountry)
                .slice(currentSlide ? currentSlide : 0,
                    !currentSlide ? ADDITIONAL_COUNTRIES : currentSlide + ADDITIONAL_COUNTRIES);
            const idVisibleCountries = visibleCountries.map(c => c.countryId);
            setVisibleCountries(VISIBLE_COUNTRIES, idVisibleCountries);
        }
    }
    const carouselContext = useContext(CarouselContext);
    const [currentSlide, setCurrentSlide] = useState(carouselContext.state.currentSlide);
    useEffect(() => {
        const onChange = () => setCurrentSlide(carouselContext.state.currentSlide);
        carouselContext.subscribe(onChange);
        return () => carouselContext.unsubscribe(onChange);
    }, [carouselContext]);

    useEffect(() => applyVisibleCountries(), [countries, currentSlide, selectedCountry]);
    const getCountriesCarousel = () =>
        countries && countries.filter(c =>
            !selectedCountry || c.countryId !== selectedCountry).sort((a, b) => a.translatedLabel.localeCompare(b.translatedLabel)).map((c, index) => {
            return <Slide key={c.countryId}
                          index={index}>{`${c.translatedLabel ? c.translatedLabel : c.country} ${c.year}`} </Slide>
        })
    return (
        <>
            <div className="navigator">
                <ButtonBack><Icon name="angle left" /></ButtonBack>
            </div>
            <div className="slider-container">
                <Slider>{getCountriesCarousel()}
                </Slider>
            </div>
            <div className="navigator">
                <ButtonNext><Icon name="angle right" /></ButtonNext>
            </div>
        </>
    )
};

export default CountryCarousel;