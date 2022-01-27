import React, {useState} from "react";
import {Grid} from "semantic-ui-react";
import './styles.scss';
import ResponsiveBarChartImpl from "../ResponsiveBarChartImpl";
import Legend from "./Legend";

const BarAndLineChart = ({data, sources, selectedYear, leftLegend, indexBy, groupMode, bottomLegend, rightLegend}) => {

    if (!data || !data.dimensions || !data.dimensions.crop) {
        return 'No Data';
    }

    const keys = [];
    const processedData = [];
    const colors = new Map();
    let max = 0;
    // TODO: move to call.
    Object.keys(data.values.days).forEach(y => {
        const item = {year: y};
        if (selectedYear && selectedYear.find(k => k === y)) {
            item[y] = data.values.days[y].days;
            if (!keys.find(k => k === y)) {
                keys.push(y);
            }
            if (item[y] > max) {
                max = item[y];
            }
            if (!colors.get(y)) {
                colors.set(y, baseColors[0])
            }
        }
        processedData.push(item);
    });
    console.log(processedData);
    console.log(keys);
    console.log(colors);

    const noData = false;
    const layout = 'vertical';
    const enableGridX = false;
    const enableGridY = true;
    const getTooltipText = (d) => {
        return <div style={{textAlign: 'center'}}>
            <span>HHI Value</span><span
            className="bold"> {d.data[d.id]}  </span><br/>
            <span>Year</span><span
            className="bold"> {d.id}  </span>
        </div>
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
            <Grid.Row className={`hhi-section`}>
                <Legend legends={legends} title={'Legend'}/>
            </Grid.Row>
            <Grid.Row className="chart-section">
                <Grid.Column width={16}>
                    <ResponsiveBarChartImpl sources={sources} data={data} noData={noData}
                                            selectedYear={selectedYear} colors={colors} max={max * 1.25} keys={keys}
                                            processedData={processedData}
                                            indexBy={indexBy} layout={layout}
                                            groupMode={groupMode}
                                            leftLegend={leftLegend} bottomLegend={bottomLegend}
                                            enableGridX={enableGridX} enableGridY={enableGridY}
                                            getTooltipText={getTooltipText} getTooltipHeader={getTooltipHeader}
                                            customTickWithCrops={customTickWithCrops} containerHeight={300}
                                            gridTickLines={4} rightLegend={rightLegend}
                    />
                </Grid.Column>
            </Grid.Row>
        </>
    )
}

// TODO: move these as props.
const baseColors = [
    '#41a9d9', '#c2db24'
]

const legends = [
    {
        id: 1,
        'color': baseColors[0],
        'label': 'Number of days for import',
    },
    {
        id: 2,
        'color': baseColors[1],
        'label': 'Industry Rating',
    }
];

export default BarAndLineChart
