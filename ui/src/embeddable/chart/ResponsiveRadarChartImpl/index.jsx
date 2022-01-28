import React, { useState } from "react";
import { ResponsiveRadar } from '@nivo/radar'
import './styles.scss';

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

const ResponsiveRadarChartImpl = ({
                                  noData,
                                  processedData,
                                  keys,
                                  colors,
                                  indexBy,
                                  containerHeight = 450
                                }) => {



  const getLabel = (item) => {
      if (item == FAKE_NUMBER) {
          return "MD"
      } else {
          return item + "%"
      }
  }

  const getColors = (item) => {
      return colors.get(item.key);
  }

  return (
    <div style={{ height: containerHeight }}>
      {!noData ? <ResponsiveRadar
          margin = {{ top: 60, right: 80, bottom: 60, left: 80 }}
          data = {processedData}
          indexBy = {indexBy}
          keys = {keys}
          dotSize = {2}
          colors= {(item) => getColors(item)}
          borderWidth = {2}
          fillOpacity = {0}
          blendMode = "multiply"
          animate = {true}
          motionConfig = "wobbly"
          isInteractive = {true}
          gridShape = "linear"
          enableDotLabel = {true}
          dotLabelYOffset = {15}
          dotLabel = {d => getLabel(d.value)}
          valueFormat = {d => getLabel(d)}
      /> : <h2 className="no-data">No Data</h2>}
    </div>
  )
}

export default ResponsiveRadarChartImpl
