import React, {useState} from "react";
import {Grid} from "semantic-ui-react";
import './styles.scss';
import ResponsiveBarChartImpl from "../ResponsiveBarChartImpl";
import HHILegend from "./HHILegend";
import {FAKE_NUMBER} from "../ChartsComponent";

const MarketConcentrationHHI = ({data, sources, selectedYear, bottomLegend}) => {

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
            if (selectedYear && selectedYear.find(k => k === y)) {
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
            }
        });
        processedData.push(item);
    });

    // Fix missing data from the EP (crop without one or more years data).
    const years = data.dimensions.year ? data.dimensions.year.values : {};
    processedData.forEach(p => {
        years.forEach(y => {
            if (!p[y]) {
                processedData.find(i => i.crop === p.crop)[y] = FAKE_NUMBER;
            }
            if (p[y] === 'MD' || p[y] === null) {
                processedData.find(i => i.crop === p.crop)[y] = FAKE_NUMBER;
            }
        });
    });

    const noData = false;
    const indexBy = 'crop';
    const layout = 'vertical';
    const groupMode = 'grouped';
    const leftLegend = 'HHI Index';
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
                <HHILegend legends={legends} title={'HHI Value'}/>
            </Grid.Row>
            <Grid.Row className="chart-section">
                {[0, 1, 2, 3].map(i => {
                    return (<Grid.Column key={i} computer={8} mobile={16}>
                        <ResponsiveBarChartImpl sources={sources} data={data} noData={noData} crops={crops}
                                                selectedYear={selectedYear} colors={colors[i]} max={max[i]} keys={keys}
                                                processedData={processedData.filter(j => j.crop === crops[i])}
                                                indexBy={indexBy} layout={layout}
                                                groupMode={groupMode}
                                                leftLegend={leftLegend} bottomLegend={bottomLegend}
                                                enableGridX={enableGridX} enableGridY={enableGridY}
                                                getTooltipText={getTooltipText} getTooltipHeader={getTooltipHeader}
                                                customTickWithCrops={customTickWithCrops} containerHeight={300}
                                                gridTickLines={4}
                        />
                    </Grid.Column>);
                })}
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

const legends = [
    {
        id: 8,
        'color': hhiColors[4].color,
        'label': 'Extremely poor (>4,000)',
    },
    {
        id: 9,
        'color': hhiColors[3].color,
        'label': 'Poor (3,000-3,999)',
    },
    {
        id: 10,
        'color': hhiColors[2].color,
        'label': 'Fair (2,000-2,999)',
    },
    {
        id: 11,
        'color': hhiColors[1].color,
        'label': 'Good (1,000-1,999)',
    },
    {
        id: 12,
        'color': hhiColors[0].color,
        'label': 'Excellent (<1000)',
    }
];

export default MarketConcentrationHHI
