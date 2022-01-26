import React, {useState} from "react";
import {Grid} from "semantic-ui-react";
import './styles.scss';
import ResponsiveBarChartImpl from "../ResponsiveBarChartImpl";

const MarketConcentrationHHI = ({data, sources}) => {

    const [selectedYear, setSelectedYear] = useState(null);
    const [currentData, setCurrentData] = useState(null);

    if (!data) {
        return 'No Data';
    }

    const crops = data.dimensions.crop.values;
    const keys = [];
    const processedData = [];
    const colors = [null, null, null, null];
    const max = [0, 0, 0, 0];
    crops.forEach((crop, i) => {
        colors[i] = new Map();
        const item = {crop: crop};
        Object.keys(data.values[crop]).forEach(y => {
            item[y] = data.values[crop][y];
            if (!keys.find(k => k === y)) {
                keys.push(y);
            }
            if (item[y] > max[i]) {
                max[i] = item[y];
            }
            if (!colors[i].get(y)) {
                colors[i].set(y, getColor(item[y]))
            }
        });
        processedData.push(item);
    });

    const noData = false;
    const indexBy = 'crop';
    const layout = 'vertical';
    const groupMode = 'grouped';
    const leftLegend = 'HHI Index';
    const bottomLegend = undefined;
    const enableGridX = false;
    const enableGridY = true;
    const getTooltipText = (d) => {
        return <>
            <span>Average Age</span><span
            className="bold"> {d.data[d.id]}  </span><br/>
            <span>Year</span><span
            className="bold"> {d.id}  </span>

        </>
    }
    const getTooltipHeader = (d) => {
        return <>
            <div className={d.indexValue.toLowerCase() + " crop-icon"}/>
            <div className="crop-name">{d.indexValue}</div>
        </>;
    }
    const customTickWithCrops = true;

    return (
        <>
            <Grid.Row className="chart-section">
                <Grid.Column computer={8} mobile={16}>
                    <ResponsiveBarChartImpl sources={sources} data={data} noData={noData} crops={crops}
                                            selectedYear={selectedYear} colors={colors[0]} max={max[0]} keys={keys}
                                            processedData={processedData.filter(i => i.crop === crops[0])}
                                            indexBy={indexBy} layout={layout}
                                            groupMode={groupMode}
                                            leftLegend={leftLegend} bottomLegend={bottomLegend}
                                            enableGridX={enableGridX} enableGridY={enableGridY}
                                            getTooltipText={getTooltipText} getTooltipHeader={getTooltipHeader}
                                            customTickWithCrops={customTickWithCrops}
                    />
                </Grid.Column>
                <Grid.Column computer={8} mobile={16}>
                    <ResponsiveBarChartImpl sources={sources} data={data} noData={noData} crops={crops}
                                            selectedYear={selectedYear} colors={colors[1]} max={max[1]} keys={keys}
                                            processedData={processedData.filter(i => i.crop === crops[1])}
                                            indexBy={indexBy} layout={layout}
                                            groupMode={groupMode}
                                            leftLegend={leftLegend} bottomLegend={bottomLegend}
                                            enableGridX={enableGridX} enableGridY={enableGridY}
                                            getTooltipText={getTooltipText} getTooltipHeader={getTooltipHeader}
                                            customTickWithCrops={customTickWithCrops}
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="chart-section">
                <Grid.Column computer={8} mobile={16}>
                    <ResponsiveBarChartImpl sources={sources} data={data} noData={noData} crops={crops}
                                            selectedYear={selectedYear} colors={colors[2]} max={max[2]} keys={keys}
                                            processedData={processedData.filter(i => i.crop === crops[2])}
                                            indexBy={indexBy} layout={layout}
                                            groupMode={groupMode}
                                            leftLegend={leftLegend} bottomLegend={bottomLegend}
                                            enableGridX={enableGridX} enableGridY={enableGridY}
                                            getTooltipText={getTooltipText} getTooltipHeader={getTooltipHeader}
                                            customTickWithCrops={customTickWithCrops}
                    />
                </Grid.Column>
                <Grid.Column computer={8} mobile={16}>
                    <ResponsiveBarChartImpl sources={sources} data={data} noData={noData} crops={crops}
                                            selectedYear={selectedYear} colors={colors[3]} max={max[3]} keys={keys}
                                            processedData={processedData.filter(i => i.crop === crops[3])}
                                            indexBy={indexBy} layout={layout}
                                            groupMode={groupMode}
                                            leftLegend={leftLegend} bottomLegend={bottomLegend}
                                            enableGridX={enableGridX} enableGridY={enableGridY}
                                            getTooltipText={getTooltipText} getTooltipHeader={getTooltipHeader}
                                            customTickWithCrops={customTickWithCrops}
                    />
                </Grid.Column>
            </Grid.Row>
        </>
    )
}

const hhiColors = [
    {upTo: 1000, color: '#276700'},
    {upTo: 1999, color: '#7dc646'},
    {upTo: 2999, color: '#ffc000'},
    {upTo: 3999, color: '#ff4f4f'},
    {upTo: 10000, color: '#c00000'}
];

const getColor = (value) => {
    if (value <= hhiColors[0].upTo) {
        return hhiColors[0].color;
    }
    if (value <= hhiColors[1].upTo) {
        return hhiColors[1].color;
    }
    if (value <= hhiColors[2].upTo) {
        return hhiColors[2].color;
    }
    if (value <= hhiColors[3].upTo) {
        return hhiColors[3].color;
    }
    if (value <= hhiColors[4].upTo) {
        return hhiColors[4].color;
    }
}

export default MarketConcentrationHHI
