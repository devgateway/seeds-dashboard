import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import { connect } from "react-redux";
import { setFilter } from "../reducers/data";
import './filter.scss'
import { getCountries } from "../reducers/data";
import { COUNTRIES_FILTER, COUNTRY_SETTINGS, SELECTED_COUNTRY } from "../reducers/StoreConstants";
import CountryFilter from "./CountryFilter";
import CountrySelector from "./countrySelector/CountrySelector";

const Filter = ({
                  onApply, countries, onLoadCountries, country_settings, filters,
                  "data-type": dataType,
                  "data-selected-country-first": selectedCountryFirst = false,
                  "data-add-year": addYear = true,
                  "data-use-id": useId = true,
                  "data-store": searchStore,
                }) => {
  useEffect(() => {
    onLoadCountries()
  }, [])
  useEffect(() => {
    if (getFirstSelectedCountry()) {
      onApply(SELECTED_COUNTRY, getFirstSelectedCountry());
    }
  }, [countries]);

  const getFirstSelectedCountry = () => {
    const pNavigationCountry = country_settings ? country_settings.country : undefined;
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
  let classes = 'filters'
  let childComponent = <CountryFilter
    countries={countries} onApply={onApply} filters={filters} addYear={addYear}
  />;
  if (dataType === "Country") {
    childComponent = <CountrySelector countries={countries} onApply={onApply} filters={filters}
                                      selectedCountryFirst={selectedCountryFirst} addYear={addYear} />
    classes = "country-selector";
  }

  return <Container fluid={true} className={classes}>{childComponent}</Container>
}

const mapStateToProps = (state, ownProps) => {
  return {
    filters: state.getIn(['data', 'filters']),
    countries: state.getIn(['data', COUNTRIES_FILTER]),
    country_settings: state.getIn(['data', COUNTRY_SETTINGS, 'data'])
  }
}

const mapActionCreators = {
  onApply: setFilter,
  onLoadCountries: getCountries
};
export default connect(mapStateToProps, mapActionCreators)(Filter)