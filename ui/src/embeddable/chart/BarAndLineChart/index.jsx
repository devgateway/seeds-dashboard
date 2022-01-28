import React, {Fragment} from "react";
import {Grid} from "semantic-ui-react";
import { line } from "d3-shape";
import { BasicTooltip, useTooltip } from '@nivo/tooltip';
import './styles.scss';
import ResponsiveBarChartImpl from "../ResponsiveBarChartImpl";
import Legend from "./Legend";

const BarAndLineChart = ({
                             data, sources, selectedYear, leftLegend, indexBy, groupMode, bottomLegend, rightLegend,
                             processedData, colors, keys, max, legends, getTooltipText, getTooltipHeader
                         }) => {

    if (!data || !data.dimensions || !data.dimensions.crop) {
        return 'No Data';
    }

    const noData = false;
    const layout = 'vertical';
    const enableGridX = false;
    const enableGridY = true;
    const customTickWithCrops = true;
    
    // TODO: move as props.
    const LineLayer = ({ bars, xScale, yScale }) => {
        console.log(keys);
        console.log(data);
        console.log(processedData);
        console.log(bars);
        console.log(colors);
        
        const lineGenerator = line()
            .x(bar => xScale(bar.data.indexValue) + bar.width / 2)
            .y(bar => yScale(bar.data.data.rating));

        const { showTooltipFromEvent, hideTooltip } = useTooltip();
        
        return (
            <Fragment>
                <path
                    d={lineGenerator(bars)}
                    fill="none"
                    stroke={'#c2db24'}
                    style={{ pointerEvents: "none" }}
                />
                {bars.map(bar => (
                    <circle
                        key={bar.key}
                        cx={xScale(bar.data.indexValue) + bar.width / 2}
                        cy={yScale(bar.data.data.rating)}
                        r={4}
                        fill='#c2db24'
                        stroke={'#c2db24'}
                        onMouseEnter={(event) =>
                            showTooltipFromEvent(<BasicTooltip id="Rating" value={bar.data.data.rating} />, event)
                        }
                        onMouseLeave={() => hideTooltip()}
                        onMouseMove={(event) =>
                            showTooltipFromEvent(<BasicTooltip id="Rating" value={bar.data.data.rating} />, event)
                        }
                    />
                ))}
            </Fragment>
        );
    };

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
                    />
                </Grid.Column>
            </Grid.Row>
        </>
    )
}

export default BarAndLineChart
