import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import { connect } from "react-redux";
import { setFilter } from "../reducers/data";
//import { CountryFilter } from './CountryFilter'
import './filter.scss'
import { getCountries } from "../reducers/data";
import { COUNTRIES_FILTER, COUNTRY_SETTINGS } from "../reducers/StoreConstants";
import CountryFilter from "./CountryFilter";

const Filter = ({
                  onApply, countries, onLoadCountries, country_settings, filters
                }) => {
  useEffect(() => {
    onLoadCountries()
  }, [])
  const addNavigationCountry = () => {
    if (countries) {
      const orderedCountries = [...countries];
      orderedCountries.some((item, idx) =>
        item.isoCode === 'ET' &&
        orderedCountries.unshift(
          orderedCountries.splice(idx, 1)[0]
        )
      )
      return orderedCountries;
    } else {
      return countries;
    }

  }
  return <Container fluid={true} className={"filters"}
  ><CountryFilter
    navigationCountry={country_settings ? country_settings.country : null}
    countries={addNavigationCountry()} onApply={onApply} filters={filters}
  /></Container>
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