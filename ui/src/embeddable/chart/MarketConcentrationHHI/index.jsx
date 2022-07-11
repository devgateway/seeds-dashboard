import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import './styles.scss';
import ResponsiveBarChartImpl from "../ResponsiveBarChartImpl";
import HHILegend from "./HHILegend";
import { FAKE_NUMBER } from "../ChartsComponent";
import NoData from "../common/noData";
import CropsLegend from "../common/crop";

const MarketConcentrationHHI = ({ data, sources, selectedYear, bottomLegend, intl, totalLabel }) => {

    if (!data) {
        return <NoData />;
    }

    const crops = data.dimensions.crop.values;
    const keys = [];
    const processedData = [];
    const colors = [null, null, null, null];
    let max = 0;
    crops.forEach((crop, i) => {
        colors[i] = new Map();
        const item = { crop: crop };
        Object.keys(data.values[crop]).forEach(y => {
            if (selectedYear && selectedYear.find(k => k === y)) {
                item[y] = data.values[crop][y];
                if (!keys.find(k => k === y)) {
                    keys.push(y);
                }
                if (item[y] > max) {
                    max = item[y];
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
    const indexBy = 'year';
    const layout = 'vertical';
    const groupMode = 'grouped';
    const leftLegend = 'HHI value';
    const enableGridX = false;
    const enableGridY = true;
    const getTooltipText = (d) => {
        return <div style={{ textAlign: 'center' }}>
            <span>HHI Value</span><span
            className="bold">
            {totalLabel.format ? intl.formatNumber(d.data[d.id], totalLabel.format) : d.data[d.id]}</span><br />
            <span>Year</span><span
            className="bold"> {d.data.year}  </span>
        </div>
    }
    const getTooltipHeader = (d) => {
        return <>
            <div className={d.data.crop.toLowerCase() + " crop-icon"} />
            <div className="crop-name">{intl.formatMessage({ id: d.data.crop, defaultMessage: d.data.crop })}</div>
        </>;
    }
    const customTickWithCropsBottom = false;
    
    const hhiProcessedData = [];
    processedData.forEach(i => {
        Object.keys(i).forEach(j => {
            if (j !== 'crop' && selectedYear.find(k => k === j)) {
                hhiProcessedData.push({year: j, value: i[j], crop: i.crop});
            }
        });
    });
    
    return (
        <>
            <Grid.Row className={`hhi-section`}>
                <HHILegend legends={hhiLegends} title={'HHI Value'} />
            </Grid.Row>
            <Grid.Row className="chart-section">
                {[0, 1, 2, 3].map(i => {
                    return (<Grid.Column key={i} computer={8} mobile={16}>
                        <div className="hhi-crops">
                            <CropsLegend data={[crops[i]]} />
                        </div>
                        <ResponsiveBarChartImpl sources={sources} data={data} noData={noData} crops={crops}
                                                selectedYear={selectedYear} colors={colors[i]} max={max * 1.25}
                                                keys={['value']}
                                                processedData={hhiProcessedData.filter(j => j.crop === crops[i])}
                                                indexBy={indexBy} layout={layout}
                                                groupMode={groupMode}
                                                leftLegend={leftLegend} bottomLegend={bottomLegend}
                                                enableGridX={enableGridX} enableGridY={enableGridY}
                                                getTooltipText={getTooltipText} getTooltipHeader={getTooltipHeader}
                                                customTickWithCropsBottom={customTickWithCropsBottom}
                                                containerHeight={300}
                                                gridTickLines={4} margins={{ top: 40, right: 10, bottom: 60, left: 70 }}
                                                padding={0.05} intl={intl}
                                                axisBottom={true} totalLabel={totalLabel} 
                                                getColorsCustom={i => getColor(i.value)}
                        />
                    </Grid.Column>);
                })}
            </Grid.Row>
        </>
    )
}

const hhiColors = [
    { upTo: 1000, color: '#75DD00' },
    { upTo: 1999, color: '#CCF000' },
    { upTo: 2999, color: '#FFFC61' },
    { upTo: 3999, color: '#FF7E37' },
    { upTo: 10000, color: '#FF3833' }
];

export const getColor = (value) => {
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

export const hhiLegends = [
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
        'label': 'Moderate (2,000-2,999)',
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
