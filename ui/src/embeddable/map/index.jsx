import React, {useEffect, useRef, useState} from "react";
import {Button, Container, Grid, GridRow, Icon, Segment} from "semantic-ui-react";
import {connect} from "react-redux";
import * as d3 from 'd3'
import {
    DATA,
    COUNTRIES_FILTER,
    SHARE_CHART,
    DEFAULT_COUNTRY_ID,
    ADEQUACY_ACTIVE_BREEDERS,
    MAP_INDICATOR_DATA,
    AVAILABILITY_BASIC_SEED,
    ADEQUACY_SEED_INSPECTION_SERVICES,
    ADEQUACY_AGRODEALER_NETWORK,
    ADEQUACY_EXTENSION_SERVICES,
    SATISFACTION_VARIETY_RELEASE_PROCESS,
    SATISFACTION_SEED_REGULATIONS,
    ADEQUACY_GOVERNMENT_EFFORT_COUNTERFEIT_SEED,
    SATISFACTION_EXPORT, LENGTH_SEED_EXPORT, SATISFACTION_IMPORT, LENGTH_SEED_IMPORT, WP_CATEGORIES,
} from "../reducers/StoreConstants";
import {MapComponent} from './components/MapComponent';
import {getCountries, getMapIndicator, setFilter} from "../reducers/data";
import {
    A1_ADEQUACY_ACTIVE_BREEDERS,
    A4_AVAILABILITY_FOUNDATION_SEED,
    B72_LENGTH_SEED_IMPORT,
    B73_SATISFACTION_IMPORT,
    B75_LENGTH_SEED_EXPORT,
    B77_SATISFACTION_EXPORT,
    C1_SATISFACTION_VARIETY_RELEASE_PROCESS,
    C2_SATISFACTION_SEED_REGULATIONS,
    C4_ADEQUACY_GOVERNMENT_EFFORT_COUNTERFEIT_SEED,
    D2_ADEQUACY_SEED_INSPECTION_SERVICES,
    E13_ADEQUACY_EXTENSION_SERVICES,
    E24_ADEQUACY_AGRODEALER_NETWORK
} from "./Constants";
import IndicatorFilter from "./components/IndicatorFilter";
import {injectIntl} from "react-intl";
import CropFilter from "../chart/common/filters/crops";
import Header from "../chart/common/header";
import './map.scss';
import HHILegend from "../chart/MarketConcentrationHHI/HHILegend";
import Export from "../chart/common/export";
import Source from "../chart/common/source";
import {cleanupParam} from "../chart/Countryinfo";
import {toBlob} from "html-to-image";
import { saveAs } from 'file-saver';
import Notes from "../chart/common/source/Notes";

let colors = [
    { color: '#fb6e6e' },
    { color: '#fba66e' },
    { color: '#f9d751' },
    { color: '#ccea7b' },
    { color: '#a5ca40' },
];
export const PERCENTAGE = '%';

const Map = (props) => {
    const [hasNotes, setHasNotes] = useState(false)
    const {filters} = props
    let indicators = [];
    let processedData = null;
    let initialSelectedCrops = [];
    let crops = null;
    let domain = [0, 100];
    let indicatorFilterTitle;
    const {
        editing = false,
        setDefaultFilter,
        onLoadIndicatorData,
        countries,
        onLoadCountries,
        locale,
        intl,
        mapData,
        "data-download": download,
        "data-height": height = 500,
        "data-map-type": type,
        "data-source-text_en": sourceText_en,
        "data-source-text_fr": sourceText_fr,
        "data-title": title = "",
        "data-sub-title": subTitle = "",
        "data-methodology": methodology,
        categoriesWP
    } = props;
    let categoryType;
    if (categoriesWP) {
        categoryType = categoriesWP.find(c => c.slug === type.toLowerCase())
    }
    useEffect(() => {
        setDefaultFilter(DEFAULT_COUNTRY_ID, 23);
        if (filters && filters.get(SHARE_CHART) && type === filters.get(SHARE_CHART)) {
            wrapper.current.scrollIntoView({block: 'end', behavior: 'smooth'});
        }
    }, []);

    useEffect(() => {
        onLoadCountries("latestCountryStudies");
    }, [onLoadCountries]);

    const [selectedIndicator, setSelectedIndicator] = useState(null);
    const [initialCrops, setInitialCrops] = useState(null);
    const [currentData, setCurrentData] = useState(null);
    const [selectedCrops, setSelectedCrops] = useState(null);
    const [dontUseCrops, setDontUseCrops] = useState(null);

    useEffect(() => {
        onLoadIndicatorData(selectedIndicator.id);
    }, [selectedIndicator]);

    const currentLanguage = locale || 'en';
    let sourceText;
    if (currentLanguage === 'en') {
        if (cleanupParam(sourceText_en)) {
            sourceText = sourceText_en;
        } else {
            sourceText = cleanupParam(sourceText_fr) || '';
        }
    } else {
        if (cleanupParam(sourceText_fr)) {
            sourceText = sourceText_fr;
        } else {
            sourceText = cleanupParam(sourceText_en) || '';
        }
    }

    const processCommonDataWithCrops = ()  => {
        processedData = [];
        if (mapData.values) {
            Object.keys(mapData.values).forEach(k => {
                if (selectedCrops) {
                    const item = Object.assign({}, mapData.values[k]);
                    item.id = k.toUpperCase()
                    item.value = item[selectedCrops];
                    item.country = countries.find(c => c.isoCode === item.id).country;
                    item.crop = selectedCrops;
                    if (item.value === 0 
                        || (item.value && item.value !== 'MD' && item.value !== 'NA' && !isNaN(item.value))) {
                        processedData.push(item);
                    } else {
                        console.warn('ignored not number: ' + item.value);
                    }
                }
            });
        }
    }
    
    const processCommonDataWithoutCrops = (recalculateDomain) => {
        processedData = [];
        if (mapData.values && mapData.values) {
            let min = 0;
            let max = 0;
            Object.keys(mapData.values).forEach(k => {
                const item = {};
                item.id = k.toUpperCase()
                item.value = mapData.values[k].value;
                item.year = mapData.values[k].year;
                item.country = countries.find(c => c.isoCode === item.id).country;
                item.crop = null;
                if (item.value === 0  
                    || (item.value && item.value !== 'MD' && item.value !== 'NA' && !isNaN(item.value))) {
                    if (recalculateDomain) {
                        if (item.value > max) {
                            max = item.value;
                        }
                        domain[1] = max;
                    }
                    processedData.push(item);
                } else {
                    console.warn('ignored not number: ' + item.value);
                }
            });
        }
    }

    if (mapData && mapData !== currentData) {
        setCurrentData(mapData);
        crops = mapData.dimensions.crop ? mapData.dimensions.crop.values : [];
        setInitialCrops(crops);
        initialSelectedCrops = null;
        setSelectedCrops(crops[0]);
    }

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
        style = {
            padding: "0px",
            marginTop: "10px",
            marginBottom: "0px",
            marginLeft: '25px',
            marginRight: '10px',
        };
        width = ref.current.childNodes[0].offsetWidth + 50;
        height = ref.current.childNodes[0].offsetHeight;

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

    if (indicators.length === 0) {
        switch (type) {
            case "indicators_A":
                indicators = [
                    {
                        value: A1_ADEQUACY_ACTIVE_BREEDERS,
                        id: ADEQUACY_ACTIVE_BREEDERS,
                        usesCrops: true,
                        numberSuffix: PERCENTAGE
                    },
                    {
                        value: A4_AVAILABILITY_FOUNDATION_SEED,
                        id: AVAILABILITY_BASIC_SEED,
                        usesCrops: true,
                        numberSuffix: PERCENTAGE
                    }
                ];
                if (!selectedIndicator) {
                    setSelectedIndicator(indicators[0]);
                    setDontUseCrops(false);
                }
                break;
            case "indicators_B":
                indicators = [{
                    value: B72_LENGTH_SEED_IMPORT,
                    id: LENGTH_SEED_IMPORT,
                    useCrops: false,
                    recalculateDomain: true,
                    numberSuffix: ' ' + intl.formatMessage({id: 'days', defaultMessage: 'days'}),
                    mapLegend: 'numberOfDays'
                }, {
                    value: B73_SATISFACTION_IMPORT, id: SATISFACTION_IMPORT, useCrops: false, numberSuffix: PERCENTAGE
                }, {
                    value: B75_LENGTH_SEED_EXPORT,
                    id: LENGTH_SEED_EXPORT,
                    useCrops: false,
                    recalculateDomain: true,
                    numberSuffix: ' ' + intl.formatMessage({id: 'days', defaultMessage: 'days'}),
                    mapLegend: 'numberOfDays'
                }, {
                    value: B77_SATISFACTION_EXPORT, id: SATISFACTION_EXPORT, useCrops: false, numberSuffix: PERCENTAGE
                }];
                if (!selectedIndicator) {
                    setSelectedIndicator(indicators[0]);
                    setDontUseCrops(!indicators[0].usesCrops);
                }
                break;
            case "indicators_C":
                indicators = [{
                    value: C1_SATISFACTION_VARIETY_RELEASE_PROCESS,
                    id: SATISFACTION_VARIETY_RELEASE_PROCESS,
                    useCrops: false,
                    numberSuffix: PERCENTAGE
                },
                    {
                        value: C2_SATISFACTION_SEED_REGULATIONS,
                        id: SATISFACTION_SEED_REGULATIONS,
                        useCrops: false,
                        numberSuffix: PERCENTAGE
                    },
                    {
                        value: C4_ADEQUACY_GOVERNMENT_EFFORT_COUNTERFEIT_SEED,
                        id: ADEQUACY_GOVERNMENT_EFFORT_COUNTERFEIT_SEED,
                        useCrops: false,
                        numberSuffix: PERCENTAGE
                    }];
                if (!selectedIndicator) {
                    setSelectedIndicator(indicators[0]);
                    setDontUseCrops(!indicators[0].usesCrops);
                }
                break;
            case "indicators_D":
                indicators = [
                    {
                        value: D2_ADEQUACY_SEED_INSPECTION_SERVICES,
                        id: ADEQUACY_SEED_INSPECTION_SERVICES,
                        usesCrops: false,
                        numberSuffix: PERCENTAGE,
                        hideFilterSection: true
                    }
                ];
                if (!selectedIndicator) {
                    setSelectedIndicator(indicators[0]);
                    setDontUseCrops(true);
                }
                break;
            case "indicators_E":
                indicators = [{
                    value: E13_ADEQUACY_EXTENSION_SERVICES,
                    id: ADEQUACY_EXTENSION_SERVICES,
                    useCrops: false,
                    numberSuffix: PERCENTAGE
                },
                    {
                        value: E24_ADEQUACY_AGRODEALER_NETWORK,
                        id: ADEQUACY_AGRODEALER_NETWORK,
                        useCrops: false,
                        numberSuffix: PERCENTAGE
                    }];
                if (!selectedIndicator) {
                    setSelectedIndicator(indicators[0]);
                    setDontUseCrops(true);
                }
                break;
        }
    }

    const handleCropFilterChange = (selected) => {
        const currentlySelected = [];
        for (let i = 0; i < selected.length; i++) {
            if (selected[i] === 1) {
                currentlySelected.push(initialCrops[i]);
            }
        }
        setSelectedCrops(currentlySelected);
    }
    
    const handleIndicatorChange = (selected) => {
        setSelectedIndicator(selected);
        setDontUseCrops(!selected.usesCrops);
    }
        
    if (countries && mapData && !mapData.LOADING && selectedIndicator) {
        switch (selectedIndicator.value) {
            case A1_ADEQUACY_ACTIVE_BREEDERS:
            case A4_AVAILABILITY_FOUNDATION_SEED:
                processCommonDataWithCrops();
                break
            case D2_ADEQUACY_SEED_INSPECTION_SERVICES:
            case E13_ADEQUACY_EXTENSION_SERVICES:
            case E24_ADEQUACY_AGRODEALER_NETWORK:
            case C1_SATISFACTION_VARIETY_RELEASE_PROCESS:
            case C2_SATISFACTION_SEED_REGULATIONS:
            case C4_ADEQUACY_GOVERNMENT_EFFORT_COUNTERFEIT_SEED:
            case B72_LENGTH_SEED_IMPORT:
            case B73_SATISFACTION_IMPORT:
            case B75_LENGTH_SEED_EXPORT:
            case B77_SATISFACTION_EXPORT:
                processCommonDataWithoutCrops(selectedIndicator.recalculateDomain);
                break;
        }
    }

    const wrapper = useRef(null);
    
    // Needed for <CropFilter/>
    if (initialCrops && !dontUseCrops) {
        initialSelectedCrops = [];
        initialCrops.forEach((c, i) => {
            initialSelectedCrops.push(i === 0 ? 1 : 0)
        });
    }

    // To reuse the colors.
    let mapColors = colors.map(c => c.color);
    
    // Update the intervals to the new domain.
    // FFR: https://github.com/d3/d3-scale/blob/main/README.md#scaleQuantize
    let scaleQ = d3.scaleQuantize().domain(domain).range(legends);
    let intervals = scaleQ.thresholds();
    const auxLegends = JSON.parse(JSON.stringify(legends));
    if (selectedIndicator) {
        const minus = selectedIndicator.numberSuffix === PERCENTAGE ? 0.01 : 1;
        const suffix = selectedIndicator.numberSuffix;
        intervals.unshift(domain[0]);
        intervals.push(domain[1]);
        
        // When the suffix is different from "%" then reverse the legends order. 
        if (suffix !== PERCENTAGE) {
            intervals = intervals.reverse();
            mapColors = mapColors.reverse();
            const auxLegends = JSON.parse(JSON.stringify(legends)).reverse();
            scaleQ = d3.scaleQuantize().domain(domain).range(auxLegends);
        }
        
        intervals.forEach((t, index) => {
            if (index > 0) {
                if (suffix === PERCENTAGE) {
                    auxLegends[index - 1]['label-range'] = '(' + intervals[index - 1] + suffix + ' - ' + (intervals[index] - (index < 5 ? minus : 0)) + suffix + ')';
                } else {
                    auxLegends[index - 1]['label-range'] = intervals[index - 1] + suffix + ' - ' + (intervals[index] - (index < 5 ? minus : 0)) + suffix;
                }
            }
        });
        // When the suffix is different from "%" then dont show any label in the legends section.
        if (suffix !== PERCENTAGE) {
            auxLegends.forEach(l => {
                l['label-key'] = null;
                l['label'] = '';
            });
        }
    }

    indicatorFilterTitle = intl.formatMessage({id: 'opinion-indicator'});
    if (selectedIndicator && 
        (selectedIndicator.value === B72_LENGTH_SEED_IMPORT || 
            selectedIndicator.value === B73_SATISFACTION_IMPORT || 
            selectedIndicator.value === B75_LENGTH_SEED_EXPORT || 
            selectedIndicator.value === B77_SATISFACTION_EXPORT)) {
        indicatorFilterTitle = intl.formatMessage({id: 'indicator'});
    }
    
    return (<div ref={wrapper}>
            <Container className={"map container"} fluid={true} style={{height: '850px', width: '100%'}}>
                <Grid className={`map-grid`}>
                    <Grid.Row className="header-section">
                        <Grid.Column width={12}>
                            <Header title={`${title}`} subtitle={subTitle} />
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Export methodology={methodology} exportPng={exportPng} download={download} containerRef={wrapper}
                                    type={'bar'} chartType={type} selectedCrops={selectedCrops ? [selectedCrops] : []} />
                        </Grid.Column>
                    </Grid.Row>
                    {selectedIndicator && !selectedIndicator.hideFilterSection && <Grid.Row className={`filters-section`}>
                        <Grid.Column width={8}>
                            <IndicatorFilter intl={intl} data={indicators} initialSelectedIndicator={selectedIndicator}
                                             onChange={handleIndicatorChange} title={indicatorFilterTitle}/>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            {!dontUseCrops && initialCrops && initialSelectedCrops &&
                                <CropFilter data={initialCrops} onChange={handleCropFilterChange}
                                            initialSelectedCrops={initialSelectedCrops} intl={intl} maxSelectable={1}/>}
                        </Grid.Column>
                    </Grid.Row>}
                    <Grid.Row className={`hhi-section`}>
                        <HHILegend legends={auxLegends} 
                                   title={intl.formatMessage({ id: 'legend', defaultMessage: 'Legend' })} />
                    </Grid.Row>
                    <Grid.Row className="map-row">
                        <Grid.Column width={16}>
                            <MapComponent domain={domain} data={processedData} height={height} intl={intl} 
                                          colors={mapColors} dontUseCrops={dontUseCrops} scale={scaleQ}
                                          legend={selectedIndicator ? selectedIndicator.mapLegend : null}
                                          numberSuffix={selectedIndicator && selectedIndicator.numberSuffix === PERCENTAGE ? selectedIndicator.numberSuffix : ''}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className={`source-section ${hasNotes ? ' no-bottom-border' : ''}`}>
                        <Grid.Column>
                            <Source title={`Source: ${sourceText}${editing ? ` *${type}*` : ''}`} />
                        </Grid.Column>
                    </Grid.Row>
                    <Notes chardIdCategory={categoryType ? categoryType.id : undefined} setHasNotes={setHasNotes} />
                </Grid>
            </Container>
        </div>
    )
}

const legends = [
    {
        id: 8,
        'color': colors[0].color,
        'label': 'Extremely poor',
        'label-range': '(0% - 19.99%)',
        'label-key': 'extremely-poor-map-legend',
    },
    {
        id: 9,
        'color': colors[1].color,
        'label': 'Poor',
        'label-key': 'poor-map-legend',
        'label-range': '(20% - 39.99%)',
    },
    {
        id: 10,
        'color': colors[2].color,
        'label': 'Fair',
        'label-key': 'fair-map-legend',
        'label-range': '(40% - 59.99%)',
    },
    {
        id: 11,
        'color': colors[3].color,
        'label': 'Good',
        'label-key': 'good-map-legend',
        'label-range': '(60% - 79.99%)',
    },
    {
        id: 12,
        'color': colors[4].color,
        'label': 'Excellent',
        'label-range': '(80% - 100%)',
        'label-key': 'excellent-map-legend',
    }
];

const mapStateToProps = (state, ownProps) => {
    return {
        countries: state.getIn([DATA, COUNTRIES_FILTER]),
        filters: state.getIn([DATA, 'filters']),
        locale: state.getIn(['intl', 'locale']),
        mapData: state.getIn([DATA, MAP_INDICATOR_DATA, DATA]),
        categoriesWP: state.getIn([DATA, WP_CATEGORIES])
    }
}

const mapActionCreators = {
    setDefaultFilter: setFilter,
    onLoadIndicatorData: getMapIndicator,
    onLoadCountries: getCountries,
};

export default connect(mapStateToProps, mapActionCreators)(injectIntl(Map))
