import React, { useState } from "react";
import { ResponsiveBar } from '@nivo/bar'
import { useResizeDetector } from 'react-resize-detector';
import './styles.scss';
import CropIcons from "../common/cropIcons";
import { getTextWidth } from "../../utils/common";
import {FAKE_NUMBER} from "../ChartsComponent";


const theme = {
  axis: {
    ticks: {
      text: {
        fontSize: 12,
        /*fontWeight: 'bold',*/
        fill: "#adafb2",
        textTransform: 'capitalize'
      },
      line: {
        stroke: "rgba(255,255,255,0)",
        strokeWidth: 0
      }
    },
    legend: {
      text: {
        fontSize: 12,
        fill: "#354052",
        fontWeight: 'normal',
        fontFamily: 'Lato',
      }
    }
  }
};

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
                                  rightLegend,
                                  LineLayer,
                                  markers,
                                  dataSuffix,
                                  showTotalLabel,
                                }) => {

  ;
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
      if (showTotalLabel) {
          if (total > 0) {
              finalText = total;
          } else {
              if (isMD) {
                  finalText = 'MD';
              }
          }
      }
      // let finalText = showTotalLabel ? total : (isMD ? "MD" : "");
      let transform = `translate(${x}, ${yScale(total) - labelMargin})`;
      let xText = width / 2;
      let yText = labelMargin / 2;
      const textHeight = 13; // TODO: add function to calculate height.
      if (layout === 'horizontal') {
        labelMargin = -5;
        transform = `translate(${xScale(total) - labelMargin},${y})`;
        xText = (getTextWidth(finalText, '14pt sans-serif') /2 ) + 5;
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
              fill:'#354052',
            }}>
            {finalText}
          </text>
        </g>);
      }
    });
    return numbers;
  };
  
  const TotalLabelsGrouped = ({ bars, yScale }) => {
    const data_ = data;
    // space between top of stacked bars and total label
    const labelMargin = 30;

    const numbers = [];
    bars.forEach(({ data: { data, indexValue, id }, x, width }, i) => {
      const transform = `translate(${x}, ${yScale(data[id]) - labelMargin})`;
      if (!numbers.find(i => i.props.transform === transform)) {
        numbers.push(<g
          transform={transform}
          key={`${indexValue}-${i}`}>
          <text
            // add any class to the label here
            className="bar-total-label"
            x={width / 2}
            y={labelMargin - 15}
            textAnchor="middle"
            alignmentBaseline="central"
            // add any style to the label here
            style={{
              fontWeight: 'bold',
              fontSize: getTextWidth(String(data[id]), '14pt sans-serif') <= width ? '14pt' : '10pt',
              fill:'#354052',
            }}>
              {data[id] !== FAKE_NUMBER
                  ? data[id]
                  : data_.values[data.crop] ? data_.values[data.crop][id] || 'MD' : 'MD'}
              {dataSuffix && Number(data[id]) >= 1 ? dataSuffix : ''}
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
      const tickX = customTickWithCropsLeft ? 100 : 0;
      const tickY = customTickWithCropsLeft ? 5 : 25;
      const translX = customTickWithCropsLeft ? 330 : 130;
      const translY = customTickWithCropsLeft ? 90 : 60;
      return (<g>
          <CropIcons crop={tick.value} text={tick.value} tick={tick} tickX={tickX} tickY={tickY}
                     style={{'textTransform': 'capitalize', fill: '#adafb2'}}/>
          { bottomLegend && customTickWithCropsBottom && tick.tickIndex === 0 ?
              <text transform={`translate(${(width - bottomLegendWidth - translX) / 2},${tick.y + translY})`}
                    style={{fontWeight: 'normal', fill: '#354052'}}>
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

  return (
    <div style={{ height: containerHeight }} ref={ref}>
      {!noData ? <ResponsiveBar
        theme={theme}
        layers={layers}
        data={processedData}
        keys={keys}
        indexBy={indexBy}
        margin={{ top: 50, right: 60, bottom: 70, left: leftMargin}}
        padding={0.3}
        valueScale={{ type: 'linear', max: max * 1.25 }}
        indexScale={{ type: 'band', round: true }}
        colors={(item) => getColors(item)}
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
          legendOffset: layout === 'horizontal' ? (-leftMargin+10) : -60,
          tickValues: gridTickLines
        }}
        layout={layout}
        groupMode={groupMode}
        gridYValues={gridTickLines}
        enableLabel={false}
        markers={markers || null}
        axisBottom={customTickWithCropsBottom? { renderTick: CustomTick } : {
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend: bottomLegend,
          legendPosition: 'middle',
          legendOffset: 45,
        }}
        axisRight={rightLegend ? {tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: rightLegend,
            legendPosition: 'middle',
            tickValues: gridTickLines,
            legendOffset: 45,} : null}
        tooltip={(d) => {
          return (<div className="tooltip-container-vrwsf">
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
      /> : <h2 className="no-data">No Data</h2>}
    </div>
  )
}

export default ResponsiveBarChartImpl
