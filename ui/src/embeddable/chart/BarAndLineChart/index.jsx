import React, {Fragment} from "react";
import {Grid} from "semantic-ui-react";
import { line } from "d3-shape";
import './styles.scss';
import ResponsiveBarChartImpl from "../ResponsiveBarChartImpl";
import Legend from "./Legend";

const BarAndLineChart = ({
                             data, sources, selectedYear, leftLegend, indexBy, groupMode, bottomLegend, rightLegend,
                             processedData, colors, keys, max, legends
                         }) => {

    if (!data || !data.dimensions || !data.dimensions.crop) {
        return 'No Data';
    }

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
            <div className={d.indexValue + " crop-icon"}/>
            <div className="crop-name">{d.indexValue}</div>
        </>;
    }
    const customTickWithCrops = true;
    
    const LineLayer = ({ bars, xScale, yScale }) => {
        console.log(keys);
        console.log(data);
        console.log(processedData);
        console.log(bars);
        const lineGenerator = line()
            .x(bar => xScale(bar.data.indexValue) + bar.width / 2)
            .y(bar => yScale(bar.data.data.rating));

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
                        style={{ pointerEvents: "none" }}
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
                                            selectedYear={selectedYear} colors={colors} max={85} keys={keys}
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
