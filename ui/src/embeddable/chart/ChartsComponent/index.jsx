import ResponsiveBarChartImpl from "../ResponsiveBarChartImpl";
import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import Header from "../common/header";
import CropFilter from "../common/filters/crops";
import Years from "../common/filters/years";
import CropsLegend from "../common/crop";
import CropsWithSpecialFeatures from "../common/cropWithSpecialFeatures";
import Source from "../common/source";
import { getColor } from "../Countryinfo/CountryInfoChart";
import {
  AVERAGE_AGE_VARIETIES_SOLD,
    MARKET_CONCENTRATION_HHI,
  NUMBER_OF_ACTIVE_BREEDERS, NUMBER_OF_ACTIVE_SEED_COMPANIES_PRODUCERS,
  VARIETIES_RELEASED_WITH_SPECIAL_FEATURES, NUMBER_VARIETIES_SOLD
} from "../../reducers/StoreConstants";
import YearLegend from "../common/year";
import MarketConcentrationHHI from "../MarketConcentrationHHI";

const ChartComponent = ({ sources, data, type, title }) => {
  const [initialCrops, setInitialCrops] = useState(null);
  const [selectedCrops, setSelectedCrops] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  //TODO can be configured in wordpress at a later stage
  let indexBy = 'crop';
  let showYearFilter = true;
  let layout = 'vertical';
  let groupMode = 'stacked';
  let withCropsWithSpecialFeatures = true;
  let addLighterDiv = true;
  let leftLegend;
  let bottomLegend;
  let enableGridX = false;
  let enableGridY = true;
  let legend = 'crops';
  let customTickWithCrops = false;
  //END TODO
  let getTooltipText;
  let getTooltipHeader;
  let crops = null;
  let noData = false;
  let years = null;
  let colors = new Map();
  const keys = [];
  let max = 0;
  let maxSelectableYear = 1;
  const processedData = [];
  const FAKE_NUMBER = 0.001;
    let useCropLegendsRow = true;
    let useFilterByCrops = true;
    
  if (!data || !data.dimensions || !data.dimensions.crop || data.id === null) {
    noData = true;
  } else {
    years = data.dimensions.year.values;
    crops = data.dimensions.crop.values;
    if (data !== currentData) {
      setCurrentData(data);
      setSelectedCrops(crops);
      setInitialCrops(crops);
      //TODO see what to use

      setSelectedYear(years.slice(0, 4))
      //setSelectedYear(years[years.length - 1])

      // workaround for selectedCrops not being updated.
      return null;
    }
    if (!initialCrops) {
      setSelectedCrops(crops);
      setInitialCrops(crops);
    } else {
      crops = selectedCrops;
    }
  }

  const handleCropFilterChange = (selected) => {
    const currentlySelected = [];
    for (let i = 0; i < selected.length; i++) {
      if (selected[i] === 1) {
        currentlySelected.push(initialCrops[i]);
      }
    }
    setSelectedCrops(currentlySelected);
  }
  const handleYearFilterChange = (selected) => {
    setSelectedYear(selected);
  }
  const numberOfActiveBreeders = () => {

    if (years && crops) {
      years.forEach(y => {
        const yearObject = { year: y };
        let maxByYear = 0;
        crops.forEach(c => {
          maxByYear += data.values[y][c];
          const objKey = y + "_" + c;
          yearObject[objKey] = data.values[y][c];
          keys.push(objKey);
          if (!colors.get(objKey)) {
            colors.set(objKey, getColor({ id: c.toLowerCase() }))
          }
        });
        if (maxByYear > max) {
          max = maxByYear;
        }
        processedData.push(yearObject);
      });
    }
  }
  const processByYear = () => {
    const newBlueColors = [...blueColors];
    crops.forEach(c => {
      const entry = { crop: c };
      Object.keys(data.values[c]).forEach((i, j) => {
        if (selectedYear && selectedYear.find(k => k === i)) {
          const key = '' + i;
          entry[key] = Number(data.values[c][i]) >= 0 ? data.values[c][i] : FAKE_NUMBER;
          if (!keys.find(i => i === key)) {
            keys.push(key);
          }
          if (!colors.get(key)) {
            colors.set(key, newBlueColors.shift());
          }
          if (Number(entry[i]) > max) {
            max = Number(entry[i]);
          }
        }
      });
      processedData.push(entry);
    });
  }

  const processVarietiesReleasedWithSpecialFeatures = () => {
    if (crops) {
      crops.forEach(c => {
        let sumWF = 0;
        let sumWOF = 0;
        if (selectedYear && selectedYear.length > 0) {
          //selected year is expected to be 1
          sumWF = data.values[c][selectedYear[0]].withspecialfeature || 0;
          sumWOF = data.values[c][selectedYear[0]].withoutspecialfeature || 0;
        } else {
          Object.keys(data.values[c]).forEach(i => {
            sumWF += data.values[c][i].withspecialfeature || 0;
            sumWOF += data.values[c][i].withoutspecialfeature || 0;
          });
        }

        const key1 = 'withSpecialFeature_' + c;
        const key2 = 'withoutSpecialFeature_' + c;
        const header = {
          crop: c,
          [key1]: sumWF,
          [key2]: sumWOF,
        };
        processedData.push(header);
        keys.push(key1);
        keys.push(key2);
        colors.set(key1, getColor({ id: c.toLowerCase() }));
        colors.set(key2, getColor({ id: c.toLowerCase() }, { fade: true }))
        if (max < (sumWF + sumWOF)) {
          max = (sumWF + sumWOF);
        }
      });
    }
  }
  switch (type) {
    case NUMBER_VARIETIES_SOLD:
    case AVERAGE_AGE_VARIETIES_SOLD:
    case NUMBER_OF_ACTIVE_SEED_COMPANIES_PRODUCERS: {
      title = 'Number of active seed companies/producers';
      if (type === NUMBER_VARIETIES_SOLD) {
        title = 'Number of varieties sold';
        getTooltipText = (d) => {
          return <>
            <span>Number of varieties sold</span><span
              className="bold"> {d.data[d.id]}  </span><br />
            <span>Year</span><span
              className="bold"> {d.id}  </span>

          </>
        }
        getTooltipHeader = (d) => {
          return <>
            <div className={d.indexValue.toLowerCase() + " crop-icon"} />
            <div className="crop-name">{d.indexValue}</div>
          </>;
        }
      } else if (type === AVERAGE_AGE_VARIETIES_SOLD) {
        getTooltipText = (d) => {
          return <>
            <span>Average Age</span><span
            className="bold"> {d.data[d.id]}  </span><br />
            <span>Year</span><span
            className="bold"> {d.id}  </span>

          </>
        }
        getTooltipHeader = (d) => {
          return <>
            <div className={d.indexValue.toLowerCase() + " crop-icon"} />
            <div className="crop-name">{d.indexValue}</div>
          </>;
        }
      } else {
        getTooltipText = (d) => {
          return <>
            <span
              className="bold"> {d.data[d.id]}  </span>
            <span>seed companies / producers </span>

          </>
        }
        getTooltipHeader = (d) => {
          return <>
            <div className={d.indexValue.toLowerCase() + " crop-icon"} />
            <div className="crop-name">{d.indexValue} {d.id}</div>
          </>;
        }
      }
      legend = 'years';
      groupMode = 'grouped';
      leftLegend = 'Number of Years';
      withCropsWithSpecialFeatures = false;
      customTickWithCrops = true;
      maxSelectableYear = 4;
      processByYear();
      break;
    }
    case VARIETIES_RELEASED_WITH_SPECIAL_FEATURES:
      getTooltipText = (d) => {
        return <><span
          className="bold"> {d.data[d.id]} out of {(d.data['withSpecialFeature_' + d.indexValue.toLowerCase()] || 0)
          + (d.data['withoutSpecialFeature_' + d.indexValue.toLowerCase()] || 0)} </span>
          <span>varieties released.</span>
        </>
      }
      getTooltipHeader = (d) => {
        return <>
          <div className={d.indexValue.toLowerCase() + " crop-icon"} />
          <div className="crop-name">{d.indexValue}</div>
        </>
      }
      leftLegend = 'Number of Varieties Released';
      bottomLegend = 'Crops';
      processVarietiesReleasedWithSpecialFeatures();
      break;
    case NUMBER_OF_ACTIVE_BREEDERS:
      getTooltipHeader = (d) => {
        const cropName = d.id.replace(`${d.indexValue}_`, "");
        return <>
          <div className={`${cropName} crop-icon`} />
          <div className="crop-name">{`${cropName} ${d.indexValue}`}</div>
        </>
      }
      getTooltipText = (d) => {
        return <><span
          className="bold"> {d.data[d.id]}  </span>
          <span>active breeders.</span>
        </>
      }
      showYearFilter = false;
      indexBy = 'year';
      leftLegend = 'Year'
      layout = 'horizontal';
      addLighterDiv = false;
      withCropsWithSpecialFeatures = false;
      showYearFilter = false;
      bottomLegend = 'Number of Breeders';
      enableGridX = true;
      enableGridY = false;
      numberOfActiveBreeders();
      break;
    case MARKET_CONCENTRATION_HHI:
        useCropLegendsRow = false;
        useFilterByCrops = false;
        title = 'Market Concentration, as Measured by the HHI (Out of 10,000)';
        maxSelectableYear = 4;
        break;  
  }
  return <Grid className={`number-varieties-released`}>
    <Grid.Row className="header-section">
      <Grid.Column>
        <Header title={title} subtitle="" />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row className={`filters-section`}>
      {!noData && useFilterByCrops ? <Grid.Column computer={3} mobile={16}>
        <CropFilter data={initialCrops} onChange={handleCropFilterChange} />
      </Grid.Column> : null}
      {(!noData && showYearFilter) ? <Grid.Column computer={3} mobile={16}>
        <Years data={years} onChange={handleYearFilterChange} maxSelectable={maxSelectableYear}
               defaultSelected={years.slice(0, maxSelectableYear)} />
      </Grid.Column> : null}
    </Grid.Row>
    {!noData && useCropLegendsRow ? <Grid.Row className={`crops-with-icons`}>
      <Grid.Column width={8}>
        {legend === 'crops' &&
          <CropsLegend data={selectedCrops} title="Crops" titleClass="crops-title" addLighterDiv={addLighterDiv} />}
        {legend === 'years' && <YearLegend colors={blueColors} years={years} />}
      </Grid.Column>
      <Grid.Column width={8} className="withSeparator">
        {withCropsWithSpecialFeatures && <CropsWithSpecialFeatures />}
      </Grid.Column>
    </Grid.Row> : null}
    {type === MARKET_CONCENTRATION_HHI ? <MarketConcentrationHHI data={data} selectedYear={selectedYear}/> : null}
    {type !== MARKET_CONCENTRATION_HHI ? (<Grid.Row className={`chart-section`}>
      <Grid.Column width={16}>
        <ResponsiveBarChartImpl sources={sources} data={data} noData={noData} crops={crops}
                                selectedYear={selectedYear} colors={colors} max={max} keys={keys}
                                processedData={processedData} indexBy={indexBy} layout={layout}
                                groupMode={groupMode}
                                leftLegend={leftLegend} bottomLegend={bottomLegend}
                                enableGridX={enableGridX} enableGridY={enableGridY}
                                getTooltipText={getTooltipText} getTooltipHeader={getTooltipHeader}
                                customTickWithCrops={customTickWithCrops}
        />
      </Grid.Column>
    </Grid.Row>) : null}
    <Grid.Row className={`source-section`}>
      <Grid.Column>
        <Source title={"Source: " + sources} />
      </Grid.Column>
    </Grid.Row>
  </Grid>
}
const blueColors = [
  '#3377b6', '#7dafde', '#9fbfdc', '#c2dbf3'
];

export default ChartComponent;
