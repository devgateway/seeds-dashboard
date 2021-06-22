import React, {useState} from "react";
import {Button, Container, Grid, Loader} from "semantic-ui-react";
import DataProvider from "../../data/DataProvider";
import {connect} from "react-redux";
import Bar from "../../charts/Bar";
import MapChart from "../../charts/MapChart";
import Radar from "../../charts/Radar";
import DataConsumer from "../../data/DataConsumer";
import {buildBarOptions, buildDivergingOptions, buildPieOptions, buildSeedInspectorOptions, buildVarietySoldOptions, buildHHIndexOptions, buildPerformanceOptions} from './chartOptionsBuilder'
import './charts.scss'
import HalfPie from "../../charts/HalfPie";
import TheContent from "../../wp/template-parts/TheContent";

const Loading = (props) => {
    return (
        <Loader
            active
            inline='centered'
            content='Loading'
            style={{
                backgroundColor: '#fff',
                marginTop: (props.height/2)+ 'px',
                marginBottom: (props.height/2)+ 'px'
            }}
        />
    )
}

const BarChar = (props) => {
    const {data, legends, colors, height, groupMode} = props
    const options = buildBarOptions(data, true)
    return <Bar groupMode={groupMode} height={height} legends={legends} colors={colors} options={options}
                format={{style: "percent", currency: "EUR"}}></Bar>
}

const SeedInspectors = (props) => {
    const {data, legends, colors, height, groupMode} = props
    const options = buildSeedInspectorOptions(data)
    const colorsSI = {colors:{'public':'#4D843F', 'private':'#F39C00'}, colorBy : 'keys'}

    return <Bar groupMode={groupMode} height={height} legends={legends} colors={colorsSI} options={options}
                format={{style: "percent", currency: "EUR"}}></Bar>
}

const HHIndex = (props) => {
    const {data, legends, colors, height, groupMode} = props
    const options = buildHHIndexOptions(data)

    return <MapChart height={height}  options={options}></MapChart>
}


const Performance = (props) => {
    const {data, legends, colors, height, groupMode} = props
    const options = buildPerformanceOptions(data)
    //TODO add more colors!
    const colorsSI = {'2020':'#4D843F', '2016':'#F39C00'}
    return <Radar height={height}  options={options} colors={colorsSI}></Radar>
}

const VarietySold = (props) => {
    const {data, legends, colors, height, groupMode} = props
    const options = buildVarietySoldOptions(data)
    const colorsSI = {colors:{'crop1Value':'#05ABFE', 'crop2Value':'#886CE6', 'crop3Value':'#FAB103', 'crop4Value':'#E97373'}, colorBy : 'keys'}

    return <Bar groupMode={groupMode} height={height} legends={legends} colors={colorsSI} options={options}
                format={{style: "percent", currency: "EUR"}}></Bar>
}

const PieChart = (props) => {
    const {data, legends, colors, height} = props
    const options = buildPieOptions(data, true)
    return <HalfPie height={height} legends={legends} colors={colors} options={options}
                    format={{style: "percent", currency: "EUR"}}></HalfPie>
}


const Diverging = (props) => {
    const {data, legends, colors, height} = props
    const options = buildDivergingOptions(data, true)
    return <Diverging height={height} legends={legends} colors={colors} options={options}
                      format={{style: "percent", currency: "EUR"}}></Diverging>
}


const Chart = (props) => {
    const CHART_LOAD_DELAY = 1 // delay loading of charts in seconds
    const {filters} = props
    const {
        editing = false,
        childContent,
        "data-height": height = 500,
        "data-chart-type": type = 'seedInspector',
        'data-source': source = 'seedInspector',
        'data-legends-left': left = 'Left Legend',
        'data-legends-bottom': bottom = 'Bottom Legend',
        'data-color-scheme': scheme = 'nivo',
        'data-color-by': colorBy = 'keys',
        'data-group-mode': groupMode = 'stacked',
        'data-dualmode': dualMode,
        'data-chart-source-label': dataSourceLabel="Source",
        'data-chart-data-source': dataSource ="NDIS",
        'data-toggle-info-label': toggleInfoLabel ="Info Graphic",
        'data-toggle-chart-label': toggleChartLabel ="Chart",
    } = props

    const [mode, setMode] = useState(editing ? "chart" : 'info')
    const [loading, setLoading] = useState(true)

    if (CHART_LOAD_DELAY > 0) {
        setTimeout(() => { setLoading(false) }, CHART_LOAD_DELAY *  1000);
    } else {
        setLoading(false) // rare scenario
    }

    const legends = {
        left: left,
        bottom: bottom
    }
    const colors = {
        scheme: scheme,
        colorBy: colorBy
    }
    let child = null
    let classStyle = "body"
    if (type === 'bar') {
        child = <BarChar height={`${height}px`} legends={legends} colors={colors} groupMode={groupMode}></BarChar>
    }
    if (type == 'halfPie') {
        child = <PieChart height={`${height}px`} legends={legends} colors={colors} groupMode={groupMode}></PieChart>
    }
    if (type == 'seedInspector') {
        child = <SeedInspectors height={`${height}px`} legends={legends} colors={colors} groupMode={groupMode}></SeedInspectors>
    }
    if (type == 'varietySold') {
        child = <VarietySold height={`${height}px`} legends={legends} colors={colors} groupMode={groupMode}></VarietySold>
    }
    if (type == 'hhIndex') {
        child = <HHIndex height={`${height}px`} legends={legends} colors={colors} groupMode={groupMode}></HHIndex>
        classStyle = "map"
    }
    if (type == 'performance') {
        child = <Performance height={`${height}px`} legends={legends} colors={colors} groupMode={groupMode}></Performance>
    }
    const dual= (dualMode === 'true')
    return <Container className={"chart container"} fluid={true}>

        <DataProvider  store={source.split("/")} source={source}>

                {(!dual|| mode == 'chart') && <Container className={classStyle} fluid={true}><DataConsumer>
                    {loading ? <Loading  height={height} />:child}
                </DataConsumer></Container>}

        </DataProvider>

        {dual&&childContent && mode == 'info' && <Container  className={"body"}>
            <TheContent post={{content: {rendered: childContent}}}></TheContent>
            </Container>}

        {!editing && dual && <Grid className={"footnote"}>
            <Grid.Column width={1}></Grid.Column>
            <Grid.Column width={7}>
            <Button className={(mode==='info')?"active":""} onClick={e=>setMode('info')}>{toggleInfoLabel}</Button> |
            <Button className={(mode==='chart')?"active":""}  onClick={e=>setMode('chart')}>{toggleChartLabel}</Button>
            </Grid.Column>
            <Grid.Column textAlign={"right"} width={7}>
            <p>{dataSourceLabel} : {dataSource}</p>
            </Grid.Column>
            <Grid.Column width={1}></Grid.Column>
        </Grid>}
    </Container>
}


const mapStateToProps = (state, ownProps) => {
    return {

    }
}

const mapActionCreators = {};

export default connect(mapStateToProps, mapActionCreators)(Chart)