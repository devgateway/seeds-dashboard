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
                                     data,
                                     noData,
                                     processedData,
                                     keys,
                                     max,
                                     colors,
                                     indexBy = 'crop',
                                     layout,
                                     leftLegend,
                                     bottomLegend,
                                     enableGridX,
                                     enableGridY,
                                     customTickWithCropsBottom,
                                     customTickWithCropsLeft,
                                     containerHeight = 450,
                                     gridTickLines = 6,
                                     LineLayer,
                                     markers,
                                     dataSuffix,
                                     showTotalLabel,
                                     showTotalMD,
                                     fixedIntervals,
                                     margins,
                                     padding,
                                     extraTooltipClass,
                                     intl,
                                     tooltip
                                 }) => {

    const getColors = (item) => {
        if (Array.isArray(item.id)) {
            return colors.get(item.id[0]);
        }
        return colors.get(item.id);
    }

    const {width, height, ref} = useResizeDetector();

    return (<div style={{height: containerHeight}} ref={ref}>
            {!noData ? <ResponsiveLine
                theme={theme}
                data={processedData}
                colors={{datum: 'color'}}
                margin={margins ? margins : {top: 50, right: 60, bottom: 70, left: 70}}
                xScale={{type: 'point'}}
                yScale={{type: 'linear', min: 'auto', max: max * 1.15, stacked: false, reverse: false}}
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
                    legend: 'Year',
                    legendOffset: 45,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Number of varieties released',
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
