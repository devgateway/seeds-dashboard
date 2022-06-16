import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import { connect } from "react-redux";
import { setFilter } from "../reducers/data";
import './filter.scss'
import { getCountries } from "../reducers/data";
import { COUNTRIES_FILTER, COUNTRY_SETTINGS, SHARE_COUNTRY } from "../reducers/StoreConstants";


import CountryFilter from "./CountryFilter";
import { SELECTED_COUNTRY } from "../../seeds-commons/commonConstants";
import CountrySelector from "../../seeds-commons/countrySelector/CountrySelector";
import { injectIntl } from "react-intl";

const ALL_COUNTRIES_ID = -1;
const Filter = ({
                    onApply, countries, onLoadCountries, country_settings, filters,
                    "data-type": dataType,
                    "data-selected-country-first": selectedCountryFirst = false,
                    "data-add-year": addYear = true,
                    "data-selected-country-label": selectedCountryLabel = undefined,
                    "data-selected-country-post-label": selectedCountryPostLabel = undefined,
                    "data-country-columns": countryColumns = 3,
                    "data-additional-classes": additionalClasses,
                    "data-data-source": dataSource = "latestCountryStudies",
                    "data-show-selector": showSelector = "true",
                    "data-add-all-countries": addAllCountries = "false",
                    setIsFilterOpen, intl
                }) => {
    const isAddAllCountries = addAllCountries === 'true';
    useEffect(() => {
        onLoadCountries(dataSource)
    }, []);

    useEffect(() => {
        if (isAddAllCountries && countries) {
            countries.unshift({
                country: intl.formatMessage({ id: 'all-countries', defaultMessage: 'all countries' }),
                countryId: ALL_COUNTRIES_ID,
                isoCode: "AA",
                year: 2020
            });
        }
        if (getFirstSelectedCountry()) {
            onApply(SELECTED_COUNTRY, getFirstSelectedCountry());
        }
    }, [countries]);

    const getFirstSelectedCountry = () => {
        const pNavigationCountry = country_settings ? country_settings.country : undefined;
        let firstSelectedCountry = undefined;
        if (filters && filters.get(SHARE_COUNTRY)) {
            firstSelectedCountry = parseInt(filters.get(SHARE_COUNTRY));
        } else {
            if (countries) {
                if (isAddAllCountries) {
                    return  ALL_COUNTRIES_ID;
                } else {
                    const defaultCountry = countries.find(c => c.isoCode === process.env.REACT_APP_DEFAULT_COUNTRY);
                    if (defaultCountry) {
                        firstSelectedCountry = defaultCountry.countryId;
                    } else {
                        firstSelectedCountry = countries[0].countryId;
                    }
                    if (pNavigationCountry) {
                        const tempFirstSelectedCountry = countries.find(c => c.isoCode === pNavigationCountry);
                        if (tempFirstSelectedCountry) {
                            firstSelectedCountry = tempFirstSelectedCountry.countryId;
                        }
                    }
                }
            }
        }
        return firstSelectedCountry;
    }
    let classes = 'filters'
    const isAddYear = addYear === true || addYear === "true";
    const isShowSelector = showSelector === 'true';
    const isSelectedCountryFirst = selectedCountryFirst === true || selectedCountryFirst === 'true';
    let childComponent = <CountryFilter
        countries={countries} onApply={onApply} filters={filters} addYear={isAddYear}
        selectedCountryLabel={selectedCountryLabel} countryColumns={countryColumns} isShowSelector={isShowSelector}
        selectedCountryPostLabel={selectedCountryPostLabel} setIsFilterOpen={setIsFilterOpen}
    />;
    if (dataType === "Country") {
        childComponent = <CountrySelector countries={countries} onApply={onApply} filters={filters}
                                          selectedCountryFirst={isSelectedCountryFirst} addYear={isAddYear}
                                          selectedCountryLabel={selectedCountryLabel} countryColumns={countryColumns}
                                          isShowSelector={isShowSelector}
                                          selectedCountryPostLabel={selectedCountryPostLabel}
                                          setIsFilterOpen={setIsFilterOpen} isAddAllCountries={isAddAllCountries} />

        classes = "country-selector " + (additionalClasses ? additionalClasses : '');
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
export default connect(mapStateToProps, mapActionCreators)(injectIntl(Filter))
