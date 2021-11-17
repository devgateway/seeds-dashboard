import React, { useEffect, useState } from "react";
import { Accordion, Container, Form, Grid, Icon, Input, Menu } from "semantic-ui-react";

import 'pure-react-carousel/dist/react-carousel.es.css';
import { CarouselProvider } from "pure-react-carousel";
import CountryCarousel from "./CountryCarousel";

export const ADDITIONAL_COUNTRIES = 3;
const CountryFilter = ({ countries, onApply, filters, navigationCountry }) => {
  const [activeIndex, setActiveIndex] = useState([0]);
  const [searchKeyword, setSearchKeyword] = useState(undefined);
  const handleSelectedCountry = (event, { value }) => {
    setActiveIndex(undefined);
    setSearchKeyword(undefined);
    onApply('selectedCountry', value);
  }
  const handleSearch = (event, { value }) => {
    setSearchKeyword(value);
  }
  const generateCountries = () => {
    return countries && countries.filter(c => {
      return searchKeyword ? c.country.toLowerCase().includes(searchKeyword.toLowerCase()) : true
    }).map(c => {
      const checked = filters && c.countryId === filters.get('selectedCountry');
      return <Grid.Column><Form.Radio
        key={c.countryId}
        checked={checked}
        className={`${checked ? 'checked' : ''}`}
        label={`${c.country} ${c.year}`} name='size' type='radio' value={c.countryId}
        onClick={handleSelectedCountry}
      /></Grid.Column>;
    });
    /*return controls ? [, ...controls] : null;*/
  }

  const getFirstSelectedCountry = () => {
    const pNavigationCountry = navigationCountry;
    let firstSelectedCountry = undefined;
    if (countries) {
      firstSelectedCountry = countries[0].countryId;
      if (pNavigationCountry) {
        const tempFirstSelectedCountry = countries.find(c => c.isoCode === pNavigationCountry);
        if (tempFirstSelectedCountry) {
          firstSelectedCountry = tempFirstSelectedCountry.countryId;
        }
      }
    }
    return firstSelectedCountry;
  }
  useEffect(() => {
    if (getFirstSelectedCountry()) {
      onApply('selectedCountry', getFirstSelectedCountry());
    }
  }, [countries]);
  const getSelectedCountry = () => {
    if (filters && filters.get('selectedCountry')) {
      if (countries) {
        const selectedCountry = countries.find(c => c.countryId === filters.get('selectedCountry'));
        return `${selectedCountry.country} ${selectedCountry.year}`;
      }
    }

  }
  const CountryForm = (
    <Form>
      <Form.Group grouped>
        <Input key="search_input" type="text" icon='search' iconPosition='left'
               placeholder="Search..." onChange={handleSearch}
               value={searchKeyword}
        />
        <Icon.Group>
          <Icon name='circle outline' />
          <Icon name='delete' size='tiny' link onClick={() => setSearchKeyword('')} />
        </Icon.Group>
      </Form.Group>
      <Grid columns={3}>
        {generateCountries()}
      </Grid>
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
    return length;
  }
  return <Grid className="country-filter-container">
    <Grid.Column width={7}>
      <Grid className={"select-country-grid"}>
        <Grid.Column width={9}>
          <Accordion as={Menu} vertical>
            <Menu.Item>
              <Accordion.Title
                active={activeIndex === 0}
                content='Select a country'
                icon="angle right"
                index={0}
                onClick={handleClick}
              />
              <Accordion.Content active={activeIndex === 0} content={CountryForm} />
            </Menu.Item>
          </Accordion>
        </Grid.Column>
        <Grid.Column width={7} className="selected-country">{getSelectedCountry()}</Grid.Column>
      </Grid>
    </Grid.Column>
    <Grid.Column width={9}>
      <Container fluid={true} className={"country-carousel"}>
        <CarouselProvider
          naturalSlideWidth={100}
          naturalSlideHeight={60}
          totalSlides={getLength()}
          visibleSlides={ADDITIONAL_COUNTRIES}
          step={3}
        >
          <CountryCarousel selectedCountry={filters ? filters.get('selectedCountry') : null}
                           countries={countries} setVisibleCountries={onApply}
                           navigationCountry={navigationCountry}
          />
        </CarouselProvider></Container>
    </Grid.Column>
  </Grid>
}
export default CountryFilter;