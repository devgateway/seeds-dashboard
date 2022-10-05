import React, {useEffect, useRef, useState} from "react";
import {Button, Container, Grid, Icon, Segment} from "semantic-ui-react";
import {connect} from "react-redux";

import {
    DATA,
    WP_CATEGORIES,
    COUNTRIES_FILTER,
    SOURCE_CATEGORIES,
    SHARE_CHART,
    SHARE_CROPS, DEFAULT_COUNTRY_ID, ADEQUACY_ACTIVE_BREEDERS, MAP_INDICATOR_DATA,
} from "../reducers/StoreConstants";
import {MapComponent} from './components/Map';
import {getCountries, getData, getMapIndicator, getWpCategories, setFilter} from "../reducers/data";
import {A1_ADEQUACY_ACTIVE_BREEDERS, A4_AVAILABILITY_FOUNDATION_SEED} from "./Constants";
import IndicatorFilter from "./components/IndicatorFilter";
import {injectIntl} from "react-intl";
import CropFilter from "../chart/common/filters/crops";

const Map = (props) => {
    const {filters} = props
    let indicators = [];
    let processedData = null;
    let initialSelectedCrops = [];
    let crops = null;
    const {
        parent,
        editing = false,
        unique,
        childContent,
        setDefaultFilter,
        onLoadCategories,
        onLoadIndicatorData,
        categoriesWP,
        countries,
        onLoadCountries,
        locale,
        intl,
        mapData,
        "data-app": app,
        "data-download": download,
        "data-height": height = 500,
        "data-map-type": type,
        "data-source-text_en": sourceText_en,
        "data-source-text_fr": sourceText_fr,
        "data-title": title = "",
        "data-sub-title": subTitle = "",
        "data-methodology": methodology,
        "data-map-data-source": mapDataSource,
        'data-params': params = '{}',
    } = props;

    useEffect(() => {
        setDefaultFilter(DEFAULT_COUNTRY_ID, 23);
        if (filters && filters.get(SHARE_CHART) && type === filters.get(SHARE_CHART)) {
            wrapper.current.scrollIntoView({block: 'end', behavior: 'smooth'});
        }
    }, []);

    useEffect(() => {
        onLoadCountries("latestCountryStudies");
    }, [onLoadCountries]);

    useEffect(() => {
        onLoadCategories()
    }, [onLoadCategories]);

    const [selectedIndicator, setSelectedIndicator] = useState(null);
    const [initialCrops, setInitialCrops] = useState(null);
    const [currentData, setCurrentData] = useState(null);
    const [selectedCrops, setSelectedCrops] = useState(null);

    useEffect(() => {
        onLoadIndicatorData(selectedIndicator.id);
    }, [selectedIndicator]);

    const processCommonData = ()  => {
        processedData = [];
        if (mapData.values) {
            Object.keys(mapData.values).forEach(k => {
                if (selectedCrops) {
                    const item = Object.assign({}, mapData.values[k]);
                    item.id = k.toUpperCase()
                    item.value = item[selectedCrops];
                    processedData.push(item);
                }
            });
        }
    }

    if (mapData && mapData !== currentData) {
        setCurrentData(mapData);
        crops = mapData.dimensions.crop ? mapData.dimensions.crop.values : {};
        setInitialCrops(crops);
        initialSelectedCrops = null;
        setSelectedCrops(crops[0]);
    }

    const exportPng = (ref, type) => {
    }

    switch (type) {
        case "indicators_A":
            indicators = [
                {value: A1_ADEQUACY_ACTIVE_BREEDERS, id: ADEQUACY_ACTIVE_BREEDERS},
                {value: A4_AVAILABILITY_FOUNDATION_SEED, id: null}
            ];
            if (!selectedIndicator) {
                setSelectedIndicator(indicators[0]);
            }
            break;
        case "indicators_B":

            break;

        case "indicators_C":

            break;

        case "indicators_D":

            break;

        case "indicators_E":

            break;
    }

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

    const mapProps = {
        title: title,
        subTitle: subTitle,
        editing: editing,
        methodology: methodology,
        download: download,
        exportPng: exportPng,
    }

    const generateSourcesText = () => {
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
        
    if (countries && mapData && !mapData.LOADING) {
        // TODO: prevent calling this method more times than needed.
        processCommonData();
    }

    const map_height = 750;
    const fixedHeightStyle = {};

    let dynamicSources = generateSourcesText();
    const mapComponent = {type, ...mapProps}
    const wrapper = useRef(null);
    
    // Needed for <CropFilter/>
    if (initialCrops) {
        initialSelectedCrops = [];
        initialCrops.forEach((c, i) => {
            initialSelectedCrops.push(i === 0 ? 1 : 0)
        });
    }
    
    return (<div ref={wrapper}>
            <Container className={"map container"} fluid={true}>
                <IndicatorFilter intl={intl} data={indicators} initialSelectedIndicator={selectedIndicator} />
                {initialCrops && initialSelectedCrops && <CropFilter data={initialCrops} onChange={handleCropFilterChange}
                            initialSelectedCrops={initialSelectedCrops} intl={intl} maxSelectable={1}/>}
                <MapComponent {...mapComponent} sources={dynamicSources} data={processedData} height={height}/>
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
        mapData: state.getIn([DATA, MAP_INDICATOR_DATA, DATA]),
    }
}

const mapActionCreators = {
    setDefaultFilter: setFilter,
    onLoadCategories: getWpCategories,
    onLoadIndicatorData: getMapIndicator,
    onLoadCountries: getCountries,
};

export default connect(mapStateToProps, mapActionCreators)(injectIntl(Map))
