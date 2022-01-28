import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import { ResponsiveBar } from '@nivo/bar'
import CropsLegend from "../common/crop";
import './styles.scss';
import Source from "../common/source";
import CropFilter from "../common/filters/crops";
import Header from "../common/header";
import { getColor } from "../Countryinfo/CountryInfoChart";
import Years from "../common/filters/years";
import CropsWithSpecialFeatures from "../common/cropWithSpecialFeatures";
import CropIcons from "../common/cropIcons";

const FAKE_NUMBER = 0.001;
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
        fill: "black",
        fontWeight: 'bold',
        /*fontFamily: 'Lato'*/
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
                                  groupMode, customTickWithCrops, 
                                  containerHeight = 450, 
                                  gridTickLines = 6,
                                  rightLegend,
                                  LineLayer
                                }) => {

  ;
  // returns a list of total value labels for stacked bars
  const TotalLabels = ({ bars, yScale, xScale }) => {
    // space between top of stacked bars and total label
    let labelMargin = 20;

    const numbers = [];
    bars.forEach(({ data: { data, indexValue }, x, y, width, height }, i) => {
      // sum of all the bar values in a stacked bar
      const total = Object.keys(data)
        //filter out whatever your indexBy value is
        .filter(key => key !== indexBy)
        .reduce((a, key) => a + data[key], 0);

      let transform = `translate(${x}, ${yScale(total) - labelMargin})`;
      let xText = width / 2;
      let yText = labelMargin / 2;
      if (layout === 'horizontal') {
        labelMargin = 10;
        transform = `translate(${xScale(total) - labelMargin},${y + (height / 3)})`;
        xText = (height / 2) - 20;
        yText = (labelMargin / 2);
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
              fontSize: '14pt'
            }}>
            {total}
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
            y={labelMargin / 2}
            textAnchor="middle"
            alignmentBaseline="central"
            // add any style to the label here
            style={{
              fontWeight: 'bold',
              fontSize: '14pt'
            }}>
            {data[id] !== FAKE_NUMBER ? data[id] : data_.values[data.crop][id]}
          </text>
        </g>);
      }
    });
    return numbers;
  };
  const getColors = (item) => {
    return colors.get(item.id);
  }
  const CustomTick = tick => {
    return <CropIcons crop={tick.value} text={tick.value} tick={tick}
                      style={{ 'textTransform': 'capitalize', fill: '#adafb2' }} />
  }
  const layers = ["grid", "axes", "bars", groupMode === 'stacked' ? TotalLabels : TotalLabelsGrouped, "markers", "legends"];
  if (LineLayer) {
      layers.push(LineLayer);
  }
  return (
    <div style={{ height: containerHeight }}>
      {!noData ? <ResponsiveBar
        theme={theme}
        layers={layers}
        data={processedData}
        keys={keys}
        indexBy={indexBy}
        margin={{ top: 50, right: 60, bottom: 70, left: 70 }}
        padding={0.3}
        valueScale={{ type: 'linear', max: max * 1.25 }}
        indexScale={{ type: 'band', round: true }}
        colors={(item) => getColors(item)}
        borderWidth={0}
        borderRadius={0}
        borderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
        axisTop={null}
        axisRight={null}
        enableGridX={enableGridX}
        enableGridY={enableGridY}
        innerPadding={groupMode === 'stacked' ? 0 : 8}
        axisLeft={{
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend: leftLegend,
          legendPosition: 'middle',
          legendOffset: -60,
          tickValues: gridTickLines
        }}
        layout={layout}
        groupMode={groupMode}
        gridYValues={gridTickLines}
        enableLabel={false}
        axisBottom={customTickWithCrops ? { renderTick: CustomTick } : {
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
