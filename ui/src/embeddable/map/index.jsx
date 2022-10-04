import React, {useEffect, useRef, useState} from "react";
import {Button, Container, Grid, Icon, Segment} from "semantic-ui-react";
import {connect} from "react-redux";

import {
    DATA,
    WP_CATEGORIES,
    COUNTRIES_FILTER,
    SOURCE_CATEGORIES,
    SHARE_CHART,
    SHARE_CROPS, DEFAULT_COUNTRY_ID,
} from "../reducers/StoreConstants";
import {MapComponent} from './components/Map';
import {getWpCategories, setFilter} from "../reducers/data";
import {A1_ADEQUACY_ACTIVE_BREEDERS, A4_AVAILABILITY_FOUNDATION_SEED} from "./Constants";
import IndicatorFilter from "./components/IndicatorFilter";
import {injectIntl} from "react-intl";

const Map = (props) => {
    const {filters} = props
    let indicators = [];
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
        intl,
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
        onLoadCategories()
    }, [onLoadCategories]);

    const [selectedIndicator, setSelectedIndicator] = useState(null);

    const exportPng = (ref, type) => {
    }

    switch (type) {
        case "indicators_A":
            indicators = [
                {value: A1_ADEQUACY_ACTIVE_BREEDERS, id: A1_ADEQUACY_ACTIVE_BREEDERS},
                {value: A4_AVAILABILITY_FOUNDATION_SEED, id: A4_AVAILABILITY_FOUNDATION_SEED}
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

    let dynamicSources = generateSourcesText();
    const mapComponent = {type, ...mapProps}
    child = <MapComponent {...mapComponent} sources={dynamicSources}/>

    const map_height = 750;
    const fixedHeightStyle = {};

    const wrapper = useRef(null);
    return (<div ref={wrapper}>
            <Container className={"map container"} fluid={true}>
                <IndicatorFilter intl={intl} data={indicators} />
                {child}
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

export default connect(mapStateToProps, mapActionCreators)(injectIntl(Map))
