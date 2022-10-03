import React, {useEffect, useRef, useState} from "react";
import {Button, Container, Grid, Icon, Segment} from "semantic-ui-react";
import DataProvider from "../data/DataProvider";
import {connect} from "react-redux";
import DataConsumer from "../data/DataConsumer";

import {
    DATA,
    WP_CATEGORIES,
    COUNTRIES_FILTER,
    SOURCE_CATEGORIES,
    SHARE_CHART,
    SHARE_CROPS, DEFAULT_COUNTRY_ID,
} from "../reducers/StoreConstants";
import {MapComponent} from './Map';
import {getWpCategories, setFilter} from "../reducers/data";

const Map = (props) => {
    const {filters} = props
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

    const exportPng = (ref, type) => {
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

export default connect(mapStateToProps, mapActionCreators)(Map)
