import React from "react";
import { ResponsivePie } from '@nivo/pie'

//"color": "hsl(209, 70%, 50%)"

const buildData = (rawData) => {
  const newData = [...Array(4)].map((value, key) => {
    return {
      "id": rawData[`nameCrop${key + 1}`].replace(/\s+/g, '-').toLowerCase(),
      "label": rawData[`nameCrop${key + 1}`],
      "value": rawData[`harvestedCrop${key + 1}`].value,
    }
  });
  return newData;
}

// TODO: move to another file.
const baseColors = {
    "maize": "#EFCB16",
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
    millet: '#000000',
    pigeon: '#000000'
}

const fadeColors = {
    "maize": "#f5dd69",
    "rice": "#73a665",
    "sorghum": "#c1cca3",
    "cowpea": "#f6a654",
    "groundnut": "#ad896c",
    "soya-bean": "#91a861",
    "soya bean": "#91a861",
    "beans": "#dedcc0",
    "bean": "#dedcc0",
    "sunflower": "#939393",
    "teff": "#679396",
    "wheat": "#d2bf62",
    millet: '#8a8a8a',
    pigeon: '#8a8a8a'
}

export const getColor = (item, options) => {
  const options_ = options || {};
  if (options_.fade) {
      debugger
      return fadeColors[item.id] || '#8a8a8a';
  } else {
      return baseColors[item.id] || '#000000';
  }
}

const CountryInfoChart = ({ rawData }) => (
  <ResponsivePie
    data={buildData(rawData)}
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
