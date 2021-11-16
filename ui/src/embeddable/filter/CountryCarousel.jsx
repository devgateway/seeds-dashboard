import { ButtonBack, ButtonNext, CarouselContext, CarouselProvider, Slide, Slider } from "pure-react-carousel";
import React, { useContext, useEffect, useState } from "react";
import { ADDITIONAL_COUNTRIES } from "./CountryFilter";


const CountryCarousel = ({ countries, selectedCountry, setVisibleCountries }) => {

  const applyVisibleCountries = () => {
    if (countries) {
      const visibleCountries = countries
        .filter(c => !selectedCountry || c.countryId !== selectedCountry)
        .slice(currentSlide ? currentSlide : 0,
          !currentSlide ? ADDITIONAL_COUNTRIES : currentSlide + ADDITIONAL_COUNTRIES);
      const idVisibleCountries = visibleCountries.map(c => c.countryId);
      setVisibleCountries('visible-countries', idVisibleCountries);
    }
  }
  const carouselContext = useContext(CarouselContext);
  const [currentSlide, setCurrentSlide] = useState(carouselContext.state.currentSlide);
  useEffect(() => {
    const onChange = () => {
      setCurrentSlide(carouselContext.state.currentSlide);
    };
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext]);

  useEffect(() => {
    applyVisibleCountries();
  }, [countries, currentSlide]);
  const getCountriesCarousel = () => {
    return countries && countries.filter(c =>
      !selectedCountry || c.countryId !== selectedCountry).map((c, index) => {
      return <Slide key={c.countryId} index={index}>{`${c.country} ${c.year}`} </Slide>
    })
  }

  return (
    <>
      <div className="navigator">
        <ButtonBack>&lt;</ButtonBack>
      </div>
      <div className="slider-container">
        <Slider>{getCountriesCarousel()}
        </Slider>
      </div>
      <div className="navigator">
        <ButtonNext>&gt;</ButtonNext>
      </div>
    </>
  )
};

export default CountryCarousel;