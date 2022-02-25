import React, {Fragment} from "react";
import {Grid} from "semantic-ui-react";
import {line} from "d3-shape";
import {BasicTooltip, useTooltip} from '@nivo/tooltip';
import * as d3 from 'd3';
import './styles.scss';
import ResponsiveBarChartImpl from "../ResponsiveBarChartImpl";
import Legend from "./Legend";
import {FAKE_NUMBER} from "../ChartsComponent";
import {getTextWidth} from "../../utils/common";
import NoData from "../common/noData";

const round = (x, y) => {
    return Math.ceil(x / y) * y;
}

/**
 * IMPORTANT: For the line chart we assume the range will ALWAYS be [0 - 100]. If that changes we need to
 * do some extra processing.
 */
const BarAndLineChart = ({
                             data, sources, selectedYear, leftLegend, indexBy, groupMode, bottomLegend, rightLegend,
                             processedData, colors, keys, max, legends, getTooltipText, getTooltipHeader, lineColor,
                             lineChartField, lineChartFieldLabel, showTotalLabel, extraTooltipClass, intl
                         }) => {

    const TICK_NUMBER = 4;
    let noData = false;
    if (!data || !data.dimensions || (!data.dimensions.crop && !data.dimensions.year) || !data.values) {
        noData = true;
    }
    let sum = 0
    if (groupMode !== "stacked") {
        Object.keys(data.values).forEach(i => {
            Object.keys(data.values[i]).forEach(j => {
                sum += Number(data.values[i][j][i]) || 0;
            });
        });
        if (sum === 0) {
            noData = true;
        }
    }

    if (noData) {
        return (<Grid.Row className="chart-section">
            <Grid.Column width={16}>
                <NoData/>
            </Grid.Column>
        </Grid.Row>);
    }

    const layout = 'vertical';
    const enableGridX = false;
    const enableGridY = true;
    const customTickWithCropsBottom = true;

    // Round to nearest number that is a factor of 10, 100, 1000, etc.
    const incrementalFactor = Number('1' + ''.padStart(String(max).length - 1, '0'));
    const newMax = round(max, incrementalFactor);

    const LineLayer = ({bars, xScale, yScale, innerWidth}) => {
        const filterIndex = [];
        const filteredBars = bars.filter(b => {
            if (b.data.data[lineChartField] !== FAKE_NUMBER) {
                if (!filterIndex.find(k => k === b.data.indexValue)) {
                    filterIndex.push(b.data.indexValue);
                    return b.data.data[lineChartField];
                }
            }
            return null;
        });

        const newYScale = d3.scaleLinear().domain([0, 100]).range(yScale.range());

        const lineGenerator = line()
            .x(bar => xScale(bar.data.indexValue) + bar.width / 2)
            .y(bar => newYScale(bar.data.data[lineChartField] || 0));

        const {showTooltipFromEvent, hideTooltip} = useTooltip();
        const chartHeight = yScale.range()[0];

        return (
            <Fragment>
                <path
                    d={lineGenerator(filteredBars)}
                    fill="none"
                    stroke={lineColor}
                    strokeWidth={2}
                    style={{pointerEvents: "none"}}
                />
                {selectedYear.length > 0 && bars.map(bar => {
                    if (selectedYear.find(i => i === bar.data.indexValue)
                        && newYScale(bar.data.data[lineChartField])
                        && bar.data.data[lineChartField] !== FAKE_NUMBER) {
                        return (<circle
                            key={bar.key}
                            cx={xScale(bar.data.indexValue) + bar.width / 2}
                            cy={newYScale(bar.data.data[lineChartField])}
                            r={5}
                            fill={lineColor}
                            stroke={lineColor}
                            onMouseEnter={(event) =>
                                showTooltipFromEvent(<div>
                                    <div className="tooltip-container-vrwsf">
                                        <div className="header-container">
                                            <div className="header">
                                                <div className="inner-container">
                                                    <div className="crop-icon"/>
                                                    <div className="crop-name">{bar.data.indexValue}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="amount-container">
                                            <table width="100%">
                                                <tbody>
                                                <tr>
                                                    <td>
                                                        <div style={{textAlign: 'center'}}>
                                                            <span>{lineChartFieldLabel}</span><span
                                                            className="bold"> {bar.data.data[lineChartField] !== FAKE_NUMBER ? bar.data.data[lineChartField] : "MD"}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>, event)
                            }
                            onMouseLeave={() => hideTooltip()}
                        />)
                    }
                    return null;
                })}
                {newYScale.ticks(TICK_NUMBER - 1).map(t => {
                    return (<text key={t} transform={`translate(${innerWidth + 25}, ${newYScale(t)})`}
                                  style={{
                                      dominantBaseline: 'central',
                                      fontSize: '12px',
                                      fill: lineColor,
                                      textAnchor: 'end',
                                      fontFamily: 'sans-serif'
                                  }}>{t}</text>);
                })}
                <text
                    transform={`translate(${innerWidth + 50}, ${chartHeight - ((chartHeight - getTextWidth(rightLegend, '16px sans-serif')) / 2)}) rotate(-90)`}
                    style={{fontFamily: 'Lato', fontSize: '16px', fill: '#354052', fontWeight: 400}}>
                    {rightLegend}
                </text>
            </Fragment>
        );
    };

    let markerLine = null;
    if (selectedYear.length === 1) {
        if (processedData.filter(i => i[lineChartField] !== FAKE_NUMBER).length !== 0) {
            const percent = processedData.find(i => i.year === selectedYear[0])[lineChartField]; // we assume max is 100.
            markerLine = [
                {
                    axis: 'y',
                    value: percent * newMax / 100,
                    lineStyle: {stroke: lineColor, strokeWidth: 2},
                    legend: '',
                    legendOrientation: 'vertical',
                }
            ];
        }
    } else if (processedData.filter(i => i[lineChartField]).length === 1
        || processedData.filter(i => i[lineChartField] !== FAKE_NUMBER).length === 1) { // Also show marker when there is only 1 point with data.
        const processedDataWithoutMD = processedData.filter(i => i[lineChartField] !== FAKE_NUMBER);
        const percent = processedDataWithoutMD.filter(i => i[lineChartField])[0][lineChartField]; // we assume max is 100.
        markerLine = [
            {
                axis: 'y',
                value: max > FAKE_NUMBER ? percent * newMax / 100 : percent * 10000 / 100,
                lineStyle: {stroke: lineColor, strokeWidth: 2},
                legend: '',
                legendOrientation: 'vertical',
            }
        ];
    }

    let fixedIntervals = [];
    const interval = newMax / TICK_NUMBER;
    for (let i = 0; i <= TICK_NUMBER; i++) {
        fixedIntervals.push(Math.round(interval * i));
    }
    fixedIntervals = fixedIntervals.sort();
    
    return (
        <>
            <Grid.Row className={`hhi-section`}>
                <Legend legends={legends} title={'Legend'}/>
            </Grid.Row>
            <Grid.Row className="chart-section">
                <Grid.Column width={16}>
                    <ResponsiveBarChartImpl sources={sources} data={data} noData={noData}
                                            selectedYear={selectedYear} colors={colors} max={newMax} keys={keys}
                                            processedData={processedData}
                                            indexBy={indexBy} layout={layout}
                                            groupMode={groupMode}
                                            leftLegend={leftLegend} bottomLegend={bottomLegend}
                                            enableGridX={enableGridX} enableGridY={enableGridY}
                                            getTooltipText={getTooltipText} getTooltipHeader={getTooltipHeader}
                                            customTickWithCropsBottom={customTickWithCropsBottom}
                                            gridTickLines={TICK_NUMBER} LineLayer={LineLayer}
                                            markers={markerLine} fixedIntervals={fixedIntervals}
                                            showTotalLabel={showTotalLabel} extraTooltipClass={extraTooltipClass}
                                            intl={intl} showTotalMD={true}
                    />
                </Grid.Column>
            </Grid.Row>
        </>
    )
}

export default BarAndLineChart
