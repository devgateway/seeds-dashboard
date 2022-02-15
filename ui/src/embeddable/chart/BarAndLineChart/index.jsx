import React, {Fragment} from "react";
import {Grid} from "semantic-ui-react";
import {line} from "d3-shape";
import {BasicTooltip, useTooltip} from '@nivo/tooltip';
import * as d3 from 'd3';
import './styles.scss';
import ResponsiveBarChartImpl from "../ResponsiveBarChartImpl";
import Legend from "./Legend";
import {FAKE_NUMBER} from "../ChartsComponent";

const BarAndLineChart = ({
                             data, sources, selectedYear, leftLegend, indexBy, groupMode, bottomLegend, rightLegend,
                             processedData, colors, keys, max, legends, getTooltipText, getTooltipHeader, lineColor,
                             lineChartField, lineChartFieldLabel, showTotalLabel
                         }) => {

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
                <h2 className="no-data">No Data</h2>
            </Grid.Column>
        </Grid.Row>);
    }

    const layout = 'vertical';
    const enableGridX = false;
    const enableGridY = true;
    const customTickWithCropsBottom = true;

    const LineLayer = ({bars, xScale, yScale}) => {
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
                            /*onMouseMove={(event) =>
                                showTooltipFromEvent(<BasicTooltip id="Rating" value={bar.data.data[lineChartField]}/>, event)
                            }*/
                        />)
                    }
                    return null;
                })}
            </Fragment>
        );
    };

    let markerLine = null;
    if (selectedYear.length === 1) {
        if (processedData.filter(i => i[lineChartField] !== FAKE_NUMBER).length !== 0) {
            markerLine = [
                {
                    axis: 'y',
                    value: processedData.find(i => i.year === selectedYear[0])[lineChartField],
                    lineStyle: {stroke: lineColor, strokeWidth: 2},
                    legend: '',
                    legendOrientation: 'vertical',
                }
            ];
        }
    } else if (processedData.filter(i => i[lineChartField]).length === 1
        || processedData.filter(i => i[lineChartField] !== FAKE_NUMBER).length === 1) { // Also show marker when there is only 1 point with data.
        const processedDataWithoutMD = processedData.filter(i => i[lineChartField] !== FAKE_NUMBER);
        markerLine = [
            {
                axis: 'y',
                value: processedDataWithoutMD.filter(i => i[lineChartField])[0][lineChartField],
                lineStyle: {stroke: lineColor, strokeWidth: 2},
                legend: '',
                legendOrientation: 'vertical',
            }
        ];
    }

    return (
        <>
            <Grid.Row className={`hhi-section`}>
                <Legend legends={legends} title={'Legend'}/>
            </Grid.Row>
            <Grid.Row className="chart-section">
                <Grid.Column width={16}>
                    <ResponsiveBarChartImpl sources={sources} data={data} noData={noData}
                                            selectedYear={selectedYear} colors={colors} max={max} keys={keys}
                                            processedData={processedData}
                                            indexBy={indexBy} layout={layout}
                                            groupMode={groupMode}
                                            leftLegend={leftLegend} bottomLegend={bottomLegend}
                                            enableGridX={enableGridX} enableGridY={enableGridY}
                                            getTooltipText={getTooltipText} getTooltipHeader={getTooltipHeader}
                                            customTickWithCropsBottom={customTickWithCropsBottom}
                                            gridTickLines={4} rightLegend={rightLegend} LineLayer={LineLayer}
                                            markers={markerLine}
                                            showTotalLabel={showTotalLabel}
                    />
                </Grid.Column>
            </Grid.Row>
        </>
    )
}

export default BarAndLineChart
