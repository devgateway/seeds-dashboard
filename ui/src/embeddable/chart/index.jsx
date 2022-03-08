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
    SOURCE_CATEGORIES, SELECTED_COUNTRY, NUMBER_SEED_INSPECTORS_BY_COUNTRY
} from "../reducers/StoreConstants";
import GaugesChart from "./GaugesChart";
import { getWpCategories, setFilter } from "../reducers/data";
import ChartComponent from "./ChartsComponent";

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
    } = props;

    useEffect(() => {
        setDefaultFilter(DEFAULT_COUNTRY_ID, defaultCountryId)
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
        case AVERAGE_AGE_VARIETIES_SOLD: {
            const chartComponent = { type, ...chartProps }
            child = <ChartComponent {...chartComponent} sources={dynamicSources} />
            break;
        }
        case COUNTRY_INFO:
            child = <CountryInfo />
            break;
        case AVAILABILITY_OF_BASIC_SEED:
        case SATISFACTION_ENFORCEMENT_SEED_LAW:
            child = <GaugesChart mostRecentYears={mostRecentYears} sources={dynamicSources} {...chartProps} type={type}
                                 title={title} subTitle={subTitle} tooltip={() => (null)} />;
            break;
    }

    // This is necessary charts that become very long in small resolutions like HHI.
    const styleHeight = window.innerWidth <= 1024 ? {} : { height: contentHeight + 'px' };

    return (<div>
            <Container className={"chart container"} style={{ "minHeight": height + 'px' }} fluid={true}>
                <DataProvider params={JSON.parse(decodeURIComponent(params))}
                              app={type}
                              source={chartDataSource}
                              csv={csv}
                              store={[type, unique]}>

                    {(!dual || (mode === 'chart')) && (
                        <Container style={styleHeight} className={"body"}
                                   fluid={true}>
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
