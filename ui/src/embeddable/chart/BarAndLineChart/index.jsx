import React, {Fragment} from "react";
import {Grid} from "semantic-ui-react";
import {line} from "d3-shape";
import {BasicTooltip, useTooltip} from '@nivo/tooltip';
import './styles.scss';
import ResponsiveBarChartImpl from "../ResponsiveBarChartImpl";
import Legend from "./Legend";

const BarAndLineChart = ({
                             data, sources, selectedYear, leftLegend, indexBy, groupMode, bottomLegend, rightLegend,
                             processedData, colors, keys, max, legends, getTooltipText, getTooltipHeader, lineColor,
                             lineChartField, lineChartFieldLabel
                         }) => {

    if (!data || !data.dimensions || (!data.dimensions.crop && !data.dimensions.year)) {
        return 'No Data';
    }

    const noData = false;
    const layout = 'vertical';
    const enableGridX = false;
    const enableGridY = true;
    const customTickWithCrops = true;


    const LineLayer = ({bars, xScale, yScale}) => {
        const filterIndex = [];
        const filteredBars = bars.filter(b => {
                if (!filterIndex.find(k => k === b.data.indexValue)) {
                    filterIndex.push(b.data.indexValue);
                    return b.data.data[lineChartField];
                }
        });

        const lineGenerator = line()
            .x(bar => xScale(bar.data.indexValue) + bar.width / 2)
            .y(bar => yScale(bar.data.data[lineChartField] || 0));

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
                    if (selectedYear.find(i => i === bar.data.indexValue)) {
                        return (<circle
                            key={bar.key}
                            cx={xScale(bar.data.indexValue) + bar.width / 2}
                            cy={yScale(bar.data.data[lineChartField])}
                            r={5}
                            fill={lineColor}
                            stroke={lineColor}
                            onMouseEnter={(event) =>
                                showTooltipFromEvent(<div>
                                    <div className="tooltip-container-vrwsf">
                                        <div className="header-container">
                                            <div className="header">
                                                <div className="inner-container">
                                                    <div className="crop-icon"></div>
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
                                                            className="bold"> {bar.data.data[lineChartField]}</span>
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
                                            customTickWithCrops={customTickWithCrops}
                                            gridTickLines={4} rightLegend={rightLegend} LineLayer={LineLayer}
                                            markers={markerLine}
                    />
                </Grid.Column>
            </Grid.Row>
        </>
    )
}

export default BarAndLineChart
