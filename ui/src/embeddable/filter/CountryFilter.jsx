import React, { useState } from "react";
import { Accordion, Grid, Menu, Form, Input, Container } from "semantic-ui-react";
import { COUNTRIES_FILTER } from "../reducers/StoreConstants";
import { getCountries, setFilter } from "../reducers/data";
import { connect } from "react-redux";
import 'pure-react-carousel/dist/react-carousel.es.css';
import { ButtonBack, ButtonNext, CarouselProvider, Slide, Slider } from "pure-react-carousel";
import CountryCarousel from "./CountryCarousel";

const CountryFilter = ({ countries, onApply, filters }) => {
  const [activeIndex, setActiveIndex] = useState([0]);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const handleSelectedCountry = (event, { value }) => {
    setActiveIndex(null);
    setSearchKeyword(null);
    onApply('selectedCountry', value);
  }
  const handleSearch = (event, { value }) => {
    setSearchKeyword(value);
  }
  const generateCountries = () => {
    const controls = countries && countries.filter(c => {
      return searchKeyword ? c.country.toLowerCase().startsWith(searchKeyword.toLowerCase()) : true
    }).map(c => {
      const checked = filters && c.countryId === filters.get('selectedCountry');
      return <Form.Radio
        checked={checked}
        className={`${checked ? 'checked' : ''}`}
        label={c.country} name='size' type='radio' value={c.countryId}
        onClick={handleSelectedCountry}
      />;
    });

    return controls ? [<Input type="text"
                              placeholder="Search..." onChange={handleSearch}
                              value={searchKeyword} />, ...controls] : null;
  }
  const getSelectedCountry = () => {
    let selectedCountry = 'Empty';
    if (filters && filters.get('selectedCountry')) {
      if (countries) {
        const selectedCountry = countries.find(c => c.countryId === filters.get('selectedCountry'));
        return `${selectedCountry.country} - ${selectedCountry.year}`;
      }
    }
    return selectedCountry;
  }
  const CountryForm = (
    <Form>
      <Form.Group grouped>
        {generateCountries()}
      </Form.Group>
    </Form>
  )
  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    setActiveIndex(activeIndex === index ? -1 : index);
  }
  const getLength = () => {
    let length = 0;
    if (countries) {
      length = countries.length;
      if (filters && filters.get('selectedCountry')) {
        length = length - 1;
      }
    }
    console.log(length);
    return length;
  }
  return <Grid className="country-filter-container">
    <Grid.Column width={6}>
      <Grid>
        <Grid.Column width={8}>
          <Accordion as={Menu} vertical>
            <Menu.Item>
              <Accordion.Title
                active={activeIndex === 0}
                content='Select country'
                index={0}
                onClick={handleClick}
              />
              <Accordion.Content active={activeIndex === 0} content={CountryForm} />
            </Menu.Item>
          </Accordion>
        </Grid.Column>
        <Grid.Column width={8} className="selected-country">{getSelectedCountry()}</Grid.Column>
      </Grid>
    </Grid.Column>
    <Grid.Column width={10}>
      <Container fluid={true} className={"country-carousel"}>
        <CarouselProvider
          naturalSlideWidth={100}
          naturalSlideHeight={60}
          totalSlides={getLength()}
          visibleSlides={4}
        >
          <CountryCarousel selectedCountry={filters ? filters.get('selectedCountry') : null}
                           countries={countries} setVisibleCountries={onApply}/>
        </CarouselProvider></Container>
    </Grid.Column>
  </Grid>
}
export default CountryFilter;