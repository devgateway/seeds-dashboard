import React, {useState} from "react";
import {Grid} from "semantic-ui-react";
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
                                            selectedYear={selectedYear} colors={colors} max={max * 1.05} keys={keys}
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

export default BarAndLineChart
