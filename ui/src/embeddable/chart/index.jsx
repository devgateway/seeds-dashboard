import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Grid, Icon, Segment } from "semantic-ui-react";
import DataProvider from "../data/DataProvider";
import { connect } from "react-redux";
import { toBlob } from 'html-to-image';
import { saveAs } from 'file-saver';
import DataConsumer from "../data/DataConsumer";
import { buildDivergingOptions, buildPieOptions } from './prevalenceBuilder'

import { PostContent } from "@devgateway/wp-react-lib";

import CountryInfo from "./Countryinfo";
import {
    COUNTRY_INFO,
    NUMBER_OF_VARIETIES_RELEASED,
    VARIETIES_RELEASED_WITH_SPECIAL_FEATURES,
    NUMBER_VARIETIES_SOLD,
    PERFORMANCE_SEED_TRADERS,
    AVAILABILITY_OF_BASIC_SEED,
    DEFAULT_COUNTRY_ID,
    AVERAGE_AGE_VARIETIES_SOLD,
    NUMBER_SEED_INSPECTORS,
    NUMBER_OF_ACTIVE_BREEDERS,
    NUMBER_OF_ACTIVE_SEED_COMPANIES_PRODUCERS,
    MARKET_CONCENTRATION_HHI,
    EFFICIENCY_SEED_IMPORT_PROCESS,
    EFFICIENCY_SEED_EXPORT_PROCESS,
    MARKET_SHARE_TOP_FOUR_SEED_COMPANIES,
    MARKET_SHARE_STATE_OWNED_SEED_COMPANIES,
    VARIETY_RELEASE_PROCESS,
    QUANTITY_CERTIFIED_SEED_SOLD,
    SATISFACTION_ENFORCEMENT_SEED_LAW,
    PRICE_SEED_PLANTING,
    AVAILABILITY_SEED_SMALL_PACKAGES,
    AGRODEALER_NETWORK,
    AGRICULTURAL_EXTENSION_SERVICES,
    DATA,
    WP_CATEGORIES,
    COUNTRIES_FILTER,
    SOURCE_CATEGORIES,
    NUMBER_SEED_INSPECTORS_BY_COUNTRY,
    SHARE_CHART,
    SHARE_CROPS,
    CROSS_COUNTRY_NUMBER_OF_ACTIVE_BREEDERS, CROSS_COUNTRY_NUMBER_OF_VARIETIES_RELEASED,
    CROSS_COUNTRY_QUANTITY_CERTIFIED_SEED_SOLD, CROSS_COUNTRY_NUMBER_OF_ACTIVE_SEED_COMPANIES,
    CROSS_COUNTRY_NUMBER_VARIETIES_SOLD,
    CROSS_COUNTRY_MARKET_SHARE_TOP_FOUR_SEED_COMPANIES,
    CROSS_COUNTRY_MARKET_CONCENTRATION_HHI,
    CROSS_COUNTRY_MARKET_SHARE_STATE_OWNED_SEED_COMPANIES,
    CROSS_COUNTRY_VARIETY_RELEASE_PROCESS,
    CROSS_COUNTRY_OVERALL_RATING_NATIONAL_SEED_TRADE_ASSOCIATION
} from "../reducers/StoreConstants";
import GaugesChart from "./GaugesChart";
import { getWpCategories, setFilter } from "../reducers/data";
import ChartComponent from "./ChartsComponent";
import { SELECTED_COUNTRY } from "../../seeds-commons/commonConstants";

const Diverging = (props) => {
    const { data, legends, colors, height } = props
    const options = buildDivergingOptions(data, true)
    return <Diverging height={height} legends={legends} colors={colors} options={options}
                      format={{ style: "percent", currency: "EUR" }} />
}


const Chart = (props) => {
    const { filters } = props
    const {
        parent,
        editing = false,
        unique,
        childContent,
        setDefaultFilter,
        onLoadCategories,
        categoriesWP,
        countries,
        locale,
        "data-app": app,
        "data-download": download,
        "data-height": height = 500,
        "data-chart-type": type,
        "data-chart-data-source": chartDataSource,
        'data-color-by': colorBy = 'index',
        'data-color-scheme': scheme = 'nivo',
        'data-group-mode': groupMode = 'stacked',
        'data-layout': layout = 'vertical',
        'data-legends-left': left = 'Left Legend',
        'data-legends-bottom': bottom = 'Bottom Legend',
        'data-dualmode': dualMode,
        'data-legend-position': legendPosition = "right",
        'data-show-legends': showLegends = "true",
        'data-chart-source-label': dataSourceLabel = "Source",
        'data-chart-data-source': dataSource = "Data Source",
        'data-toggle-info-label': toggleInfoLabel = "Info Graphic",
        'data-toggle-chart-label': toggleChartLabel = "Chart",
        'data-params': params = '{}',
        'data-number-format': format = '{"style":"percent", "minimumFractionDigits": 1, "maximumFractionDigits": 1}',
        'data-tick-rotation': tickRotation = 0,
        'data-tick-color': tickColor = "rgb(92,93,99)",
        'data-keys': keys = null,
        'data-style': style = "decimal",
        "data-decimals": decimals = "2",
        'data-currency': currency = "",
        "data-csv": csv = "",
        "data-sources": sources = "",
        "data-title": title = "",
        "data-sub-title": subTitle = "",
        "data-most-recent-years": mostRecentYears = 5,
        "data-default-country-id": defaultCountryId = 9,
        "data-use-source-by-category": useSourceByCategory,
        "data-methodology": methodology,
        "data-total-land-area-label": totalLandArea = "Total area land",
        "data-total-land-area-unit": totalLandAreaUnit = "Hectares",
        "data-total-arable-land-label": arableLand = "Arable land",
        "data-top-harvested-crops-and-value_en": topHarvestedCropsAndValue_en = "Top Harvested Crops and Value",
        "data-top-harvested-crops-and-value_fr": topHarvestedCropsAndValue_fr = "Top Harvested Crops and Value",
        "data-top-harvested-crops-and-value-unit": topHarvestedCropsAndValueUnit = "hectares",
        "data-population-vs-farming-households_en": populationVsFarmingHouseholds_en = "Population vs Farming Households",
        "data-population-vs-farming-households_fr": populationVsFarmingHouseholds_fr = "Population vs Farming Households",
        "data-total-population-label_en": totalPopulationLabel_en="Total Population",
        "data-total-population-label_fr": totalPopulationLabel_fr="Total Population",
        "data-farming-households-label_en": farmingHouseholdsLabel_en="Farming Households",
        "data-farming-households-label_fr": farmingHouseholdsLabel_fr="Farming Households",
        "data-source-text_en": sourceText_en,
        "data-source-text_fr": sourceText_fr,
    } = props;

    useEffect(() => {
        setDefaultFilter(DEFAULT_COUNTRY_ID, defaultCountryId);
        if (filters && filters.get(SHARE_CHART) && type === filters.get(SHARE_CHART)) {
            wrapper.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        onLoadCategories()
    }, [onLoadCategories]);

    function filter(node) {
        if (node.classList) {
            return !node.classList.contains("ignore") && !node.classList.contains("angle")
        }
        return true;
    }

    const exportPng = (ref, type) => {
        let style = null;
        let width = 0;
        let height = 0;
        switch (type) {
            case 'gauge':
                style = {
                    padding: "0px",
                    marginTop: "10px",
                    marginBottom: "0px",
                    marginLeft: '10px',
                    marginRight: '0px',
                };
                width = ref.current.childNodes[0].offsetWidth + 20;
                height = ref.current.childNodes[0].offsetHeight + 20;
                break;
            default:
                style = {
                    padding: "0px",
                    marginTop: "10px",
                    marginBottom: "0px",
                    marginLeft: '25px',
                    marginRight: '0px',
                };
                width = ref.current.childNodes[0].offsetWidth + 15;
                height = ref.current.childNodes[0].offsetHeight;
        }

        toBlob(ref.current, {
            filter,
            "backgroundColor": "#FFF",
            width: width,
            height: height,
            style: style
        })
            .then(function (blob) {
                saveAs(blob, title + ' export.png');
            });
    }

    const numberFormat = { style, minimumFractionDigits: parseInt(decimals), maximumFractionDigits: parseInt(decimals) }
    if (currency !== "") {
        numberFormat["currency"] = currency
    }
    const [mode, setMode] = useState(editing ? "chart" : 'info')

    let child = null
    let contentHeight;
    const showDataSource = false;
    if (editing) {
        contentHeight = height - 145;
    } else {
        if (showDataSource) {
            contentHeight = height - 40;
        } else {
            contentHeight = height;
        }
    }

    const chartProps = {
        groupMode: groupMode,
        layout: layout,
        title: title,
        subTitle: subTitle,
        editing: editing,
        methodology: methodology,
        download: download,
        exportPng: exportPng,
    }

    const generateSourcesText = () => {
        const currentLanguage = locale || 'en';
        const separator = '||';
        let ret = sources || separator;

        if (useSourceByCategory !== "true") {
            ret = sources;
            return ret;
        }

        if (categoriesWP && filters && countries) {
            const selectedCountry = filters.getIn([SELECTED_COUNTRY]);
            const defaultCountry = Number(filters.getIn([DEFAULT_COUNTRY_ID]));
            const country = countries.find(i => {
                if (selectedCountry) {
                    return selectedCountry === i.countryId;
                } else if (defaultCountry) {
                    return defaultCountry === i.countryId;
                }
                return null;
            });
            const category = categoriesWP.find(i => i.name === SOURCE_CATEGORIES);
            if (!category) {
                return ret;
            }
            const mainCountryCategory = categoriesWP.find(i => i.parent === category.id
                && i.name.toLowerCase() === country.country.toLowerCase());
            if (!mainCountryCategory) {
                return ret;
            }
            const texts = categoriesWP.filter(i => i.parent === mainCountryCategory.id);
            if (!texts || texts.length === 0) {
                return ret;
            }
            if (texts.find(i => i.name.indexOf(currentLanguage + separator) === 0)) {
                ret += texts.find(i => i.name.indexOf(currentLanguage + separator) === 0).name.substring(4);
            } else {
                ret += texts[0].name.substring(4);
            }
            return ret;
        } else {
            return ret;
        }
    }
    let dynamicSources = generateSourcesText();

    const dual = (dualMode === 'true')
    switch (type) {
        case NUMBER_OF_VARIETIES_RELEASED:
        case VARIETIES_RELEASED_WITH_SPECIAL_FEATURES:
        case NUMBER_OF_ACTIVE_BREEDERS:
        case NUMBER_OF_ACTIVE_SEED_COMPANIES_PRODUCERS:
        case MARKET_CONCENTRATION_HHI:
        case MARKET_SHARE_TOP_FOUR_SEED_COMPANIES:
        case MARKET_SHARE_STATE_OWNED_SEED_COMPANIES:
        case NUMBER_VARIETIES_SOLD:
        case EFFICIENCY_SEED_IMPORT_PROCESS:
        case EFFICIENCY_SEED_EXPORT_PROCESS:
        case PERFORMANCE_SEED_TRADERS:
        case NUMBER_SEED_INSPECTORS:
        case QUANTITY_CERTIFIED_SEED_SOLD:
        case VARIETY_RELEASE_PROCESS:
        case PRICE_SEED_PLANTING:
        case AVAILABILITY_SEED_SMALL_PACKAGES:
        case AGRODEALER_NETWORK:
        case AGRICULTURAL_EXTENSION_SERVICES:
        case NUMBER_SEED_INSPECTORS_BY_COUNTRY:
        case AVERAGE_AGE_VARIETIES_SOLD:
        case CROSS_COUNTRY_NUMBER_OF_VARIETIES_RELEASED:    
        case CROSS_COUNTRY_NUMBER_OF_ACTIVE_BREEDERS:
        case CROSS_COUNTRY_QUANTITY_CERTIFIED_SEED_SOLD:
        case CROSS_COUNTRY_NUMBER_OF_ACTIVE_SEED_COMPANIES:
        case CROSS_COUNTRY_NUMBER_VARIETIES_SOLD:
        case CROSS_COUNTRY_MARKET_SHARE_TOP_FOUR_SEED_COMPANIES:
        case CROSS_COUNTRY_MARKET_CONCENTRATION_HHI:
        case CROSS_COUNTRY_MARKET_SHARE_STATE_OWNED_SEED_COMPANIES:
        case CROSS_COUNTRY_VARIETY_RELEASE_PROCESS:
        case CROSS_COUNTRY_OVERALL_RATING_NATIONAL_SEED_TRADE_ASSOCIATION: {
            const chartComponent = { type, ...chartProps }
            child = <ChartComponent {...chartComponent} sources={dynamicSources} />
            break;
        }
        case COUNTRY_INFO:
            const labels = {
                totalLandArea,
                arableLand,
                totalLandAreaUnit,
                topHarvestedCropsAndValue_en,
                topHarvestedCropsAndValue_fr,
                topHarvestedCropsAndValueUnit,
                populationVsFarmingHouseholds_en,
                populationVsFarmingHouseholds_fr,
                totalPopulationLabel_en,
                totalPopulationLabel_fr,
                farmingHouseholdsLabel_en,
                farmingHouseholdsLabel_fr,
                sourceText_en,
                sourceText_fr
            };
            child = <CountryInfo labels={labels} locale={locale} />
            break;
        case AVAILABILITY_OF_BASIC_SEED:
        case SATISFACTION_ENFORCEMENT_SEED_LAW:
            child = <GaugesChart mostRecentYears={mostRecentYears} sources={dynamicSources} {...chartProps} type={type}
                                 title={title} subTitle={subTitle} tooltip={() => (null)} />;
            break;
    }

    // For every chart we set the height that shows the content with the best look.
    let fixedHeight = {
        [NUMBER_OF_ACTIVE_BREEDERS]: 742,
        [NUMBER_OF_VARIETIES_RELEASED]: 741,
        [VARIETIES_RELEASED_WITH_SPECIAL_FEATURES]: 741,
        [AVAILABILITY_OF_BASIC_SEED]: 698,
        [NUMBER_OF_ACTIVE_SEED_COMPANIES_PRODUCERS]: 740,
        [QUANTITY_CERTIFIED_SEED_SOLD]: 743,
        [NUMBER_VARIETIES_SOLD]: 745,
        [AVERAGE_AGE_VARIETIES_SOLD]: 743,
        [MARKET_CONCENTRATION_HHI]: 880,
        [MARKET_SHARE_TOP_FOUR_SEED_COMPANIES]: 772,
        [MARKET_SHARE_STATE_OWNED_SEED_COMPANIES]: 743,
        [EFFICIENCY_SEED_IMPORT_PROCESS]: 730,
        [EFFICIENCY_SEED_EXPORT_PROCESS]: 685,
        [VARIETY_RELEASE_PROCESS]: 640,
        [SATISFACTION_ENFORCEMENT_SEED_LAW]: 380,
        [PERFORMANCE_SEED_TRADERS]: 845,
        [NUMBER_SEED_INSPECTORS]: 685,
        [AGRICULTURAL_EXTENSION_SERVICES]: 760,
        [AGRODEALER_NETWORK]: 730,
        [AVAILABILITY_SEED_SMALL_PACKAGES]: 725,
        [PRICE_SEED_PLANTING]: 695,
        [CROSS_COUNTRY_NUMBER_OF_ACTIVE_BREEDERS]: 875,
        [CROSS_COUNTRY_NUMBER_OF_VARIETIES_RELEASED]: 875,
        [CROSS_COUNTRY_QUANTITY_CERTIFIED_SEED_SOLD]: 875,
        [CROSS_COUNTRY_NUMBER_OF_ACTIVE_SEED_COMPANIES]: 875,
        [CROSS_COUNTRY_NUMBER_VARIETIES_SOLD]: 875,
        [CROSS_COUNTRY_MARKET_SHARE_TOP_FOUR_SEED_COMPANIES]: 875,
        [CROSS_COUNTRY_MARKET_CONCENTRATION_HHI]: 875,
        [CROSS_COUNTRY_MARKET_SHARE_STATE_OWNED_SEED_COMPANIES]: 875,
        [CROSS_COUNTRY_VARIETY_RELEASE_PROCESS]: 875,
        [CROSS_COUNTRY_OVERALL_RATING_NATIONAL_SEED_TRADE_ASSOCIATION]: 875
    };
    const fixedHeightStyle = { height: (fixedHeight[type] ? fixedHeight[type] : 550) + 'px' };

    // This is necessary for charts that become very long in small resolutions like HHI.
    const styleHeight = window.innerWidth <= 1024 ? {} : { height: contentHeight + 'px' };
    const wrapper = useRef(null);
    return (<div ref={wrapper}>
            <Container className={"chart container"} fluid={true}>
                <DataProvider params={JSON.parse(decodeURIComponent(params))}
                              app={type}
                              source={chartDataSource}
                              csv={csv}
                              store={[type, unique]}>

                    {(!dual || (mode === 'chart')) && (
                        <Container className={"body"} fluid={true} style={fixedHeightStyle}>
                            <DataConsumer>
                                {child}
                            </DataConsumer>
                        </Container>)
                    }
                </DataProvider>

                {dual && childContent && mode === 'info' &&
                    <Container fluid={true} style={{ "height": contentHeight + 'px' }} className={"body"}>
                        <PostContent post={{ content: { rendered: childContent } }} />
                    </Container>}

                {(!editing && showDataSource) && <Grid columns={2} className={"footnote"}>

                    <Grid.Column>
                        {dual &&
                            <p className={"ignore"}>
                                <Button className={(mode === 'info') ? "active" : ""}
                                        onClick={e => setMode('info')}>{toggleInfoLabel}</Button>
                                |
                                <Button className={(mode === 'chart') ? "active" : ""}
                                        onClick={e => setMode('chart')}>{toggleChartLabel}
                                </Button>
                            </p>
                        }
                    </Grid.Column>

                    <Grid.Column textAlign={"right"}>
                        <p>{dataSourceLabel} : {dataSource}</p>
                    </Grid.Column>
                </Grid>}
            </Container>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        categoriesWP: state.getIn([DATA, WP_CATEGORIES]),
        countries: state.getIn([DATA, COUNTRIES_FILTER]),
        filters: state.getIn([DATA, 'filters']),
        locale: state.getIn(['intl', 'locale']),
    }
}

const mapActionCreators = {
    setDefaultFilter: setFilter,
    onLoadCategories: getWpCategories
};

export default connect(mapStateToProps, mapActionCreators)(Chart)
