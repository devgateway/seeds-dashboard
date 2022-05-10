import React, { useEffect, useState } from "react";
import { Accordion, Container, Form, Grid, Icon, Input, Menu } from "semantic-ui-react";

import 'pure-react-carousel/dist/react-carousel.es.css';
import { CarouselProvider } from "pure-react-carousel";
import CountryCarousel from "./CountryCarousel";
import CountrySelector from "../../seeds-commons/countrySelector/CountrySelector";
import { SELECTED_COUNTRY } from "../../seeds-commons/commonConstants";

export const ADDITIONAL_COUNTRIES = 3;
const CountryFilter = ({ countries, onApply, filters, addYear, countryColumns, isShowSelector, setIsFilterOpen }) => {

    const getLength = () => {
        let length = 0;
        if (countries) {
            length = countries.length;
            if (filters && filters.get(SELECTED_COUNTRY)) {
                length = length - 1;
            }
        }
        return length;
    }
    return <Grid className="country-filter-container">
        <Grid.Column width={7}>
            <CountrySelector countries={countries} onApply={onApply} filters={filters} addYear={addYear}
                             countryColumns={countryColumns} isShowSelector={isShowSelector} 
                             setIsFilterOpen={setIsFilterOpen}/>
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
                    <CountryCarousel selectedCountry={filters ? filters.get(SELECTED_COUNTRY) : null}
                                     countries={countries} setVisibleCountries={onApply}
                    />
                </CarouselProvider></Container>
        </Grid.Column>
    </Grid>
}

export default CountryFilter;
