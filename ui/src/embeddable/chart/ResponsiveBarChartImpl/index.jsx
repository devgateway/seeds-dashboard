import React, { useState } from "react";
import { ResponsiveBar } from '@nivo/bar'
import { useResizeDetector } from 'react-resize-detector';
import './styles.scss';
import CropIcons from "../common/cropIcons";
import { getTextWidth } from "../../utils/common";
import {FAKE_NUMBER, MD} from "../ChartsComponent";
import NoData from "../common/noData";

const theme = {
    axis: {
        ticks: {
            text: {
                fontSize: 12,
                /*fontWeight: 'bold',*/
                fill: "#adafb2",
                /*textTransform: 'capitalize'*/
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
                fontWeight: 'normal',
                fontFamily: 'Lato',
            }
        }
    }
};
const ALL_FAKE_MAX = 1000;

const ResponsiveBarChartImpl = ({
                                    data,
                                    noData, processedData,
                                    keys,
                                    max,
                                    colors,
                                    indexBy = 'crop',
                                    layout,
                                    leftLegend,
                                    bottomLegend,
                                    enableGridX,
                                    enableGridY,
                                    getTooltipText,
                                    getTooltipHeader,
                                    groupMode,
                                    customTickWithCropsBottom,
                                    customTickWithCropsLeft,
                                    containerHeight = 450,
                                    gridTickLines = 6,
                                    LineLayer,
                                    markers,
                                    dataSuffix,
                                    totalLabel,
                                    showTotalMD,
                                    fixedIntervals,
                                    margins,
                                    padding,
                                    extraTooltipClass,
                                    intl,
                                    getColorsCustom,
                                    axisBottom = true,
                                    isCrossCountryChart,
                                    animate = true,
                                    customSorting = false
                                }) => {
    let pMax = max;
    let allFake = true;
    if (processedData && processedData.length > 0) {
        processedData.forEach(d => {
            Object.keys(d).forEach(k => {
                if (k !== indexBy && d[k] !== FAKE_NUMBER) {
                    allFake = false;
                }
            })
        })
    }
    if (allFake) {
        pMax = ALL_FAKE_MAX;
    }
    const lnMD = intl.formatMessage({id: 'md'});
    
    // returns a list of total value labels for stacked bars
    const TotalLabels = ({ bars, yScale, xScale }) => {
        // space between top of stacked bars and total label
        let labelMargin = 20;
        const numbers = [];
        bars.forEach(({ data: { data, indexValue }, x, y, width, height }, i) => {
            // sum of all the bar values in a stacked bar
            let isMD = true;
            const total = Object.keys(data)
                //filter out whatever your indexBy value is
                .filter(key => key !== indexBy)
                .reduce((a, key) => {
                    if (keys.find(k => k === key) && data[key] !== FAKE_NUMBER) {
                        isMD = false;
                        return a + data[key];
                    } else {
                        return a;
                    }
                }, 0);

            let finalText = '';
            if (totalLabel.show) {
                if (total >= 0) {
                    if (totalLabel.format) {
                        finalText = `${intl.formatNumber(total, totalLabel.format)} `;
                    } else {
                        finalText = total;
                    }
                } else {
                    if (isMD && showTotalMD) {
                        finalText = lnMD;
                    }
                }
            }
            if (showTotalMD && isMD) {
                finalText = lnMD;
            }

            // let finalText = showTotalLabel ? total : (isMD ? lnMD : "");
            let transform = `translate(${x}, ${yScale(total) - labelMargin})`;
            let xText = width / 2;
            let yText = labelMargin / 2;
            const textHeight = 13; // TODO: add function to calculate height.
            if (layout === 'horizontal') {
                labelMargin = -5;
                transform = `translate(${xScale(total) - labelMargin},${y})`;
                xText = (getTextWidth(finalText, '14pt sans-serif') / 2) + 5;
                yText = height - ((height - textHeight) / 2);
            }

            if (!numbers.find(i => i.props.transform === transform)) {
                numbers.push(<g
                    transform={transform}
                    key={`${indexValue}-${i}`}>
                    <text
                        // add any class to the label here
                        className="bar-total-label"
                        x={xText}
                        y={yText}
                        textAnchor="middle"
                        // add any style to the label here
                        style={{
                            fontWeight: 'bold',
                            fontSize: '14pt',
                            fill: '#354052',
                        }}>
                        {finalText}
                    </text>
                </g>);
            }
        });
        return numbers;
    };

    const TotalLabelsGrouped = ({ bars, yScale, xScale }) => {
        const data_ = data;
        // space between top of stacked bars and total label
        let labelMargin = 30;

        const numbers = [];
        bars.forEach(({ data: { data, indexValue, id }, x, y, width, height }, i) => {
            let value = data[id];
            if (!value) {
                value = data_.values[data.crop] ? data_.values[data.crop][id] : null;
            }
            let transform = `translate(${x}, ${yScale(Number(value)) - labelMargin})`;
            
            let text = "";
            if (value !== FAKE_NUMBER && Number(value) !== FAKE_NUMBER) {
                if (!isNaN(value)) {
                    text = value;
                } else {
                    text = lnMD;
                }
            } else {
                if (data_.values[data.crop]) {
                    if (data_.values[data.crop][id] === MD) {
                        text = lnMD;
                    } else {
                        text = data_.values[data.crop][id] || lnMD;
                    }
                } else {
                    text = lnMD;
                }
            }
            if (totalLabel && totalLabel.format && value !== FAKE_NUMBER) {
                text = intl.formatNumber(value, totalLabel.format);
            }
            if (dataSuffix && Number(value) >= 0 && value !== FAKE_NUMBER) {
                text += dataSuffix
            }

            let xText = width / 2;
            let yText = labelMargin - 15;
            const isFirefox = typeof InstallTrigger !== 'undefined';
            const textHeight = isFirefox ? 13 : 0; // TODO: add function to calculate height.
            if (layout === 'horizontal') {
                labelMargin = 0;
                transform = `translate(${xScale(value) - labelMargin},${y})`;
                if (text === lnMD || text === MD) {
                    xText = 20;
                } else {
                    text = totalLabel.format && !isNaN(text) ? intl.formatNumber(text, totalLabel.format) : text;
                    xText = (Number(value) > FAKE_NUMBER || dataSuffix === '%') ? x + (getTextWidth(text, '13pt sans-serif') / 2) + 5 : 10;
                }
                yText = height - ((height - textHeight) / 2);
            }
            
            if (!numbers.find(i => i.props.transform === transform)) {
                numbers.push(<g
                    transform={transform}
                    key={`${indexValue}-${i}`}>
                    <text
                        // add any class to the label here
                        className="bar-total-label"
                        x={xText}
                        y={yText}
                        textAnchor="middle"
                        alignmentBaseline="central"
                        // add any style to the label here
                        style={{
                            fontWeight: 'bold',
                            fontSize: (getTextWidth(text, '13pt sans-serif') <= width || layout === 'horizontal') ? '13pt' : '10pt',
                            fill: '#354052',
                        }}>
                        {text}
                    </text>
                </g>);
            }
        });
        return numbers;
    };
    
    const getColors = (item) => {
        if (Array.isArray(item.id)) {
            return colors.get(item.id[0]);
        }
        return colors.get(item.id);
    }

    const { width, height, ref } = useResizeDetector();

    const CustomTick = tick => {
        const bottomLegendWidth = getTextWidth(bottomLegend || '', "12px sans-serif");
        let tickX = null;
        let tickY = null;
        let translX = null;
        let translY = null;
        let posX = null;
        if (customTickWithCropsLeft) {
            tickX = 100;
            tickY = 5;
            translX = 330;
            translY = 90;
            posX = tick.x - tickX
        } else {
            tickY = 25;
            translX = 130;
            translY = 60;
            const ICON_WIDTH = 30;
            const ICON_SPACE = 8;
            const translated = intl.formatMessage({ id: tick.value, defaultMessage: tick.value });
            const tickWidthWithIcon = (getTextWidth(translated, "16px sans-serif") - ICON_SPACE - ICON_WIDTH) / 2;
            posX = tick.x - tickWidthWithIcon;
        }

        return (<g>
            <CropIcons crop={tick.value} tick={tick} tickX={posX} tickY={tickY} style={{ fill: '#adafb2' }}
                       intl={intl} />
            {bottomLegend && customTickWithCropsBottom && tick.tickIndex === 0 ?
                <text transform={`translate(${(width - bottomLegendWidth - translX) / 2},${tick.y + translY})`}
                      style={{ fontWeight: 'normal', fill: '#354052' }}>
                    {bottomLegend}
                </text> : null}
        </g>);
    }

    const layers = ["grid", "axes", "bars", groupMode === 'stacked' ? TotalLabels : TotalLabelsGrouped, "markers", "legends"];
    if (LineLayer) {
        layers.push(LineLayer);
    }
    let leftMargin = customTickWithCropsLeft ? 170 : 70;
    if (layout === 'horizontal') {
        processedData.forEach(i => {
            if (getTextWidth(i[indexBy]) > leftMargin) {
                leftMargin = getTextWidth(i[indexBy], '12px sans-serif');
            }
        });
        leftMargin += 40;
    }
    
    let auxData = processedData;
    if (customSorting) {
        auxData = auxData.sort(customSorting);
    }

    return (
        <div style={{ height: containerHeight }} ref={ref}>
            {!noData ? <ResponsiveBar
                theme={theme}
                layers={layers}
                data={auxData}
                keys={keys}
                indexBy={indexBy}
                margin={margins ? margins : { top: 35, right: 60, bottom: 70, left: leftMargin }}
                padding={padding || 0.3}
                valueScale={{ type: 'linear', max: pMax }}
                indexScale={{ type: 'band', round: true }}
                colors={getColorsCustom ? item => getColorsCustom(item) : (item) => getColors(item)}
                borderWidth={0}
                borderRadius={0}
                borderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
                axisTop={null}
                enableGridX={enableGridX}
                enableGridY={enableGridY}
                innerPadding={groupMode === 'stacked' ? 0 : 8}
                axisLeft={customTickWithCropsLeft ? { renderTick: CustomTick } : {
                    tickSize: 0,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: leftLegend,
                    legendPosition: 'middle',
                    legendOffset: layout === 'horizontal' ? (-leftMargin + 10) : -60,
                    tickValues: fixedIntervals || gridTickLines
                }}
                layout={layout}
                groupMode={groupMode}
                gridYValues={fixedIntervals || gridTickLines}
                enableLabel={false}
                markers={markers || null}
                animate={animate}
                axisBottom={axisBottom ? (customTickWithCropsBottom ? { renderTick: CustomTick } : {
                    tickSize: 0,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: bottomLegend,
                    legendPosition: 'middle',
                    legendOffset: 45,
                }) : false}
                tooltip={(d) => {
                    return (<div className={"tooltip-container-vrwsf " + extraTooltipClass || ''}>
                        <div className="header-container">
                            <div className="header">
                                <div className="inner-container">
                                    {getTooltipHeader(d)}
                                </div>
                            </div>
                        </div>
                        <div className="amount-container">
                            <table width="100%">
                                <tbody>
                                <tr>
                                    <td>{getTooltipText(d)}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>)
                }}
            /> : <NoData />}
        </div>
    )
}

export default ResponsiveBarChartImpl
