import React from "react";
import { ResponsivePie } from '@nivo/pie'
import { getCropsArray } from "./index";

// TODO: move to another file.
export const baseColors = {
    "maize": "#EFCB16",
    "hybrid": "#EFCB16",
    "opv": "#EFCB16",
    "rice": "#3A5F2E",
    "sorghum": "#798161",
    "cowpea": "#F38E28",
    "groundnut": "#894F1F",
    "soya-bean": "#83A33E",
    "soya bean": "#83A33E",
    "beans": "#C5C39E",
    "bean": "#C5C39E",
    "sunflower": "#3F3F3F",
    "teff": "#20676C",
    "wheat": "#A78D0C",
    millet: '#878786',
    pigeon: '#878786',
    'pigeon-pea': '#a78d0c'
}

const fadeColors = {
    "maize": "#f7e58b",
    "rice": "#9daf97",
    "sorghum": "#bcc0b0",
    "cowpea": "#f9c694",
    "groundnut": "#c4a78f",
    "soya-bean": "#c1d19e",
    "soya bean": "#c1d19e",
    "beans": "#e2e1ce",
    "bean": "#e2e1ce",
    "sunflower": "#939393",
    "teff": "#90b3b6",
    "wheat": "#d3c686",
    millet: '#c3c3c2',
    pigeon: '#c3c3c2',
   'pigeon-pea': '#c3c3c2'
}

export const getColor = (item, options) => {
  const options_ = options || {};
  if (options_.fade) {
      return fadeColors[item.id] || '#8a8a8a';
  } else {
      return baseColors[item.id] || '#000000';
  }
}

const CountryInfoChart = ({ rawData }) => (
  <ResponsivePie
    data={getCropsArray(rawData)}
    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={0}
    activeOuterRadiusOffset={8}
    colors={item => {
      return getColor(item);
    }}
    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
    enableArcLinkLabels={false}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: 'color' }}
    enableArcLabels={false}
    arcLabelsSkipAngle={11}
    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
    isInteractive={false}
    legends={[]}
  />
)
export default CountryInfoChart;
