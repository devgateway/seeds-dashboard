import { ButtonBack, ButtonNext, CarouselContext, CarouselProvider, Slide, Slider } from "pure-react-carousel";
import React, { useContext, useEffect, useState } from "react";
import { Container } from "semantic-ui-react";


const CountryCarousel = ({ countries, selectedCountry }) => {


  const carouselContext = useContext(CarouselContext);
  const [currentSlide, setCurrentSlide] = useState(carouselContext.state.currentSlide);
  useEffect(() => {
    const onChange = () => {
      setCurrentSlide(carouselContext.state.currentSlide);

    };
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext]);
  console.log(currentSlide);
  if (countries) {

    console.log(countries.filter(c => !selectedCountry || c.countryId !== selectedCountry).slice(currentSlide ? currentSlide : 0, !currentSlide ? 4 : currentSlide + 4));
  }

  const getCountriesCarousel = () => {
    return countries && countries.filter(c =>
      !selectedCountry || c.countryId !== selectedCountry).map((c, index) => {
      return <Slide index={index}>{c.country}</Slide>
    })
  }
  return (
    <React.Fragment>
      <Slider>{getCountriesCarousel()}
      </Slider>
      <ButtonBack>Back</ButtonBack>
      <ButtonNext>Next</ButtonNext>
    </React.Fragment>
  )
};

export default CountryCarousel;