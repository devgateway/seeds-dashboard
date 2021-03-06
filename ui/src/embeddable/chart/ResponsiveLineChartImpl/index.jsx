import React, {useRef, useState} from "react";
import {ResponsiveLine} from "@nivo/line";
import {injectIntl} from "react-intl";
import './styles.scss';
import NoData from "../common/noData";
import {useResizeDetector} from "react-resize-detector";

const theme = {
    axis: {
        ticks: {
            text: {
                fontSize: 12,
                fill: "#adafb2",
            },
            line: {
                stroke: "rgba(255,255,255,0)",
                strokeWidth: 0
            }
        },
        legend: {
            text: {
                fontSize: 16,
                fill: "#354052",
                fontWeight: '400',
                fontFamily: 'Lato',
            }
        }
    }
};

const ResponsiveLineChartImpl = ({
                                     noData,
                                     processedData,
                                     max,
                                     leftLegend,
                                     bottomLegend,
                                     enableGridX,
                                     enableGridY,
                                     containerHeight = 450,
                                     margins,
                                     tooltip
                                 }) => {

    const {width, height, ref} = useResizeDetector();

    return (<div style={{height: containerHeight}} ref={ref}>
            {!noData ? <ResponsiveLine
                curve={'monotoneX'}
                theme={theme}
                data={processedData}
                colors={{datum: 'color'}}
                margin={margins ? margins : {top: 50, right: 60, bottom: 70, left: 70}}
                xScale={{type: 'point'}}
                yScale={{type: 'linear', min: 0, max: max * 1.15, stacked: false, reverse: false}}
                yFormat=" >-.0r"
                axisTop={null}
                axisRight={null}
                enableGridX={enableGridX}
                enableGridY={enableGridY}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: bottomLegend,
                    legendOffset: 45,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: leftLegend,
                    legendOffset: -60,
                    legendPosition: 'middle',
                    format: e => Math.floor(e) === e && e,
                    tickValues: 5
                }}
                gridYValues={5}
                pointBorderWidth={2}
                pointSize={10}
                pointColor={{from: 'color', modifiers: []}}
                pointBorderColor={{from: 'serieColor', modifiers: []}}
                pointLabelYOffset={-12}
                useMesh={true}
                animate={false}
                tooltip={tooltip}
            /> : <NoData/>}
        </div>
    )
}

export default injectIntl(ResponsiveLineChartImpl)
