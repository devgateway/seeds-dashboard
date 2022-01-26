import React, { useEffect, useRef, useState } from "react";
import {Button, Container, Grid, Icon, Segment} from "semantic-ui-react";
import DataProvider from "../data/DataProvider";
import {connect} from "react-redux";
import {toBlob} from 'html-to-image';
import {saveAs} from 'file-saver';
import DataConsumer from "../data/DataConsumer";
import {buildDivergingOptions, buildPieOptions} from './prevalenceBuilder'

import HalfPie from "./HalfPie";

import {PostContent} from "@devgateway/wp-react-lib";

import CountryInfo from "./Countryinfo";
import {
  COUNTRY_INFO,
  NUMBER_OF_VARIETIES_RELEASED,
  VARIETIES_RELEASED_WITH_SPECIAL_FEATURES,
  NUMBER_VARIETIES_SOLD,
  AVAILABILITY_OF_BASIC_SEED, DEFAULT_COUNTRY_ID,
  AVERAGE_AGE_VARIETIES_SOLD,
  NUMBER_OF_ACTIVE_BREEDERS, NUMBER_OF_ACTIVE_SEED_COMPANIES_PRODUCERS
} from "../reducers/StoreConstants";
import NumberOfVarietiesReleased from "./NumberOfVarietiesReleased";
import AvailabilityOfBasicSeed from "./AvailabilityOfBasicSeed";
import { setFilter } from "../reducers/data";
import ChartComponent from "./ChartsComponent";

const PieChart = (props) => {
    const {data, legends, colors, height} = props
    const options = buildPieOptions(data, true)
    return <HalfPie height={height} legends={legends} colors={colors} options={options}
                    format={{style: "percent"}}></HalfPie>
}

const Diverging = (props) => {
    const {data, legends, colors, height} = props
    const options = buildDivergingOptions(data, true)
    return <Diverging height={height} legends={legends} colors={colors} options={options}
                      format={{style: "percent", currency: "EUR"}}></Diverging>
}


const Chart = (props) => {
    const {filters} = props
    const {
        parent,
        editing = false,
        unique,
        childContent,
        setDefaultFilter,
        "data-app": app,
        "data-download": download,
        "data-height": height = 500,
        "data-chart-type": type,
        "data-chart-data-source":chartDataSource,
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
        "data-default-country-id": defaultCountryId = 9

    } = props;
    const ref = useRef(null);
  useEffect(() => {
    setDefaultFilter(DEFAULT_COUNTRY_ID, defaultCountryId)
  }, []);

    function filter(node) {
        if (node.classList) {
            return !node.classList.contains("ignore")
        }
        return true;
    }

    const exportPng = () => {
        toBlob(ref.current, {filter, "backgroundColor": "#FFF", style: {"padding": "0px", "margin": "0px"}})
            .then(function (blob) {
                saveAs(blob, 'export.png');
            });
    }

    const numberFormat = {style, minimumFractionDigits: parseInt(decimals), maximumFractionDigits: parseInt(decimals)}
    if (currency != "") {
        numberFormat["currency"] = currency
    }
    const itemWidth = props["data-legends-width"] ? parseInt(props["data-legends-width"]) : 180
    const [mode, setMode] = useState(editing ? "chart" : 'info')

    const legends = {
        left: left,
        bottom: bottom
    }
    const colors = {
        scheme: scheme,
        colorBy: colorBy
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

    const chartProps = {
        groupMode: groupMode,
        layout:layout,
        title:title,
        subTitle:subTitle,
        editing:editing
    }

    const dual = (dualMode === 'true')
    switch (type) {
        case NUMBER_OF_VARIETIES_RELEASED:
          child = <NumberOfVarietiesReleased sources={sources} {...chartProps} type={type} />;
            break;
        case VARIETIES_RELEASED_WITH_SPECIAL_FEATURES:
        case NUMBER_OF_ACTIVE_BREEDERS:
        case NUMBER_OF_ACTIVE_SEED_COMPANIES_PRODUCERS:
        case NUMBER_VARIETIES_SOLD:
        case AVERAGE_AGE_VARIETIES_SOLD:
            {
              const chartComponent = { sources, type, ...chartProps }
              child = <ChartComponent {...chartComponent} />
              break;
            }
        case COUNTRY_INFO:
            child = <CountryInfo/>
            break;
        case AVAILABILITY_OF_BASIC_SEED:
          child = <AvailabilityOfBasicSeed mostRecentYears={mostRecentYears} sources={sources} {...chartProps} />;
            break;
    }
    return (<div ref={ref}>
            <Container className={"chart container"} style={{"minHeight": height + 'px'}} fluid={true}>
                {download === 'true' && <Button className={"download ignore"} onClick={e => exportPng()}>
                    Download
                    <Icon name={"download"}></Icon>
                </Button>}
                <DataProvider params={JSON.parse(decodeURIComponent(params))}
                              app={type}
                              source={chartDataSource}
                              csv={csv}
                              store={[type, unique]}>

                    {(!dual || (mode == 'chart')) && (
                        <Container style={{"height": `${contentHeight}px`}} className={"body"}
                                   fluid={true}>
                            <DataConsumer>
                                {child}
                            </DataConsumer>
                        </Container>)
                    }
                </DataProvider>

                {dual && childContent && mode == 'info' &&
                <Container fluid={true} style={{"height": contentHeight + 'px'}} className={"body"}>
                    <PostContent post={{content: {rendered: childContent}}}></PostContent>
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
    return {}
}

const mapActionCreators = { setDefaultFilter: setFilter };

export default connect(mapStateToProps, mapActionCreators)(Chart)
