import ResponsiveBarChartImpl from "../ResponsiveBarChartImpl";
import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import Header from "../common/header";
import CropFilter from "../common/filters/crops";
import Years from "../common/filters/years";
import CropsLegend from "../common/crop";
import Export from "../common/export";
import CropsWithSpecialFeatures from "../common/cropWithSpecialFeatures";
import Source from "../common/source";
import { getColor } from "../Countryinfo/CountryInfoChart";
import {
  AVERAGE_AGE_VARIETIES_SOLD,
    MARKET_CONCENTRATION_HHI, PERFORMANCE_SEED_TRADERS,
  NUMBER_OF_ACTIVE_BREEDERS, NUMBER_OF_ACTIVE_SEED_COMPANIES_PRODUCERS,
  VARIETIES_RELEASED_WITH_SPECIAL_FEATURES, NUMBER_VARIETIES_SOLD,
  EFFICIENCY_SEED_IMPORT_PROCESS
} from "../../reducers/StoreConstants";
import YearLegend from "../common/year";
import MarketConcentrationHHI from "../MarketConcentrationHHI";
import ResponsiveRadarChartImpl from "../ResponsiveRadarChartImpl";
import { injectIntl } from "react-intl";
import BarAndLineChart from "../BarAndLineChart";

const ChartComponent = ({ sources, data, type, title, subTitle, editing, intl }) => {
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
  let rightLegend;
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
  let yearsColors = blueColors;

  if (!data || !data.dimensions || (!data.dimensions.crop && !data.dimensions.year) || data.id === null) {
    noData = true;
  } else {
    years = data.dimensions.year ? data.dimensions.year.values : {};
    crops = data.dimensions.crop ? data.dimensions.crop.values : {};
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
          if (data.values[y][c]) {
            maxByYear += data.values[y][c];
            const objKey = y + "_" + c;
            yearObject[objKey] = data.values[y][c];
            keys.push(objKey);
            if (!colors.get(objKey)) {
              colors.set(objKey, getColor({ id: c.toLowerCase() }))
            }
          }
        });
        if (maxByYear > max) {
          max = maxByYear;
        }
        processedData.push(yearObject);
      });
    }
  }

  const commonProcess = (c, entry, yearColors) => {
    const newBlueColors = [...yearColors];
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
  }

  const processByYear = () => {
    crops.forEach(c => {
      const entry = { crop: c };
      commonProcess(c, entry, blueColors);
    });
  }

  const processForRadar = (dimensionValues) => {
    dimensionValues.forEach(d => {
      const entry = {};
      entry[indexBy] =  intl.formatMessage({
        id: d,
        defaultMessage: d
      });
      commonProcess(d, entry, performanceColors);
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
      leftLegend = intl.formatMessage({id: 'number-of-years', defaultMessage: 'Number of Years'});
      if (type === NUMBER_VARIETIES_SOLD) {
        getTooltipText = (d) => {
          return <>
            <span>{intl.formatMessage({id: 'tooltip-number-of-varieties-sold', defaultMessage: 'Number of varieties sold'})}</span>
            <span className="bold"> {d.data[d.id]}  </span><br />
            <span>{intl.formatMessage({id: 'tooltip-year', defaultMessage: 'Year'})}</span>
            <span className="bold"> {d.id}  </span>
          </>
        }
        getTooltipHeader = (d) => {
          return <>
            <div className={d.indexValue.toLowerCase() + " crop-icon"} />
            <div className="crop-name">{d.indexValue}</div>
          </>;
        }
        leftLegend = intl.formatMessage({id: 'number-of-varieties-sold', defaultMessage: 'Number of varieties sold'});
      } else if (type === AVERAGE_AGE_VARIETIES_SOLD) {
        getTooltipText = (d) => {
          return <>
            <span>{intl.formatMessage({id: 'tooltip-average-age', defaultMessage: 'Average Age'})}</span><span
            className="bold"> {d.data[d.id]}  </span><br />
            <span>{intl.formatMessage({id: 'tooltip-year', defaultMessage: 'Year'})}</span><span
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
      legend = intl.formatMessage({id: 'years-legend', defaultMessage: 'Years'});
      groupMode = 'grouped';
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
      leftLegend = intl.formatMessage({id: 'number-of-varieties-released', defaultMessage: 'Number of Varieties Released'});
      bottomLegend = intl.formatMessage({id: 'crops-legend', defaultMessage: 'Crops'});
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
      leftLegend = intl.formatMessage({id: 'years-legend', defaultMessage: 'Years'});
      layout = 'horizontal';
      addLighterDiv = false;
      withCropsWithSpecialFeatures = false;
      showYearFilter = false;
      bottomLegend = intl.formatMessage({id: 'number-of-breeders-legend', defaultMessage: 'Number of Breeders'});
      enableGridX = true;
      enableGridY = false;
      numberOfActiveBreeders();
      break;
    case MARKET_CONCENTRATION_HHI:
        useCropLegendsRow = false;
        useFilterByCrops = false;
        maxSelectableYear = 4;
        break;
    case PERFORMANCE_SEED_TRADERS:
      indexBy = "id";
      legend = "years";
      useFilterByCrops = false;
      showYearFilter = true;
      maxSelectableYear = 5;
      withCropsWithSpecialFeatures = false;
      yearsColors = performanceColors;
      processForRadar(data.dimensions.performance.values)
      break;
    case EFFICIENCY_SEED_IMPORT_PROCESS:
      useCropLegendsRow = false;
      useFilterByCrops = false;
      maxSelectableYear = 4;
      leftLegend = 'Number of days for import';
      indexBy = 'year';
      bottomLegend = 'Year';
      groupMode = 'grouped';
      rightLegend = 'Rating out of 100';
      keys.push(['value']);
      Object.keys(data.values.days).forEach(y => {
        const item = {year: y};
        if (selectedYear && selectedYear.find(k => k === y)) {
          item.value = data.values.days[y].days;
          item.rating = data.values.rating[y].rating;
          if (item[y] > max) {
            max = item[y];
          }
          if (item.rating > max) {
              max = item.rating;
          }
          processedData.push(item);
        }
      });
      colors.set('value', barPieColor[0])
      getTooltipText = (d) => {
        return <div style={{textAlign: 'center'}}>
          <span>Days for Import</span>
          <span className="bold"> {d.data[d.id]}</span>
        </div>
      }
      getTooltipHeader = (d) => {
        return <>
          <div className={d.indexValue + " crop-icon"}/>
          <div className="crop-name">{d.indexValue}</div>
        </>;
      }
      break;
  }

  const insertChart = () => {
    switch (type) {
      case MARKET_CONCENTRATION_HHI:
        return <MarketConcentrationHHI data={data} selectedYear={selectedYear}/>
      case EFFICIENCY_SEED_IMPORT_PROCESS:
        return <BarAndLineChart data={data} selectedYear={selectedYear} leftLegend={leftLegend}
                                indexBy={indexBy} groupMode={groupMode} bottomLegend={bottomLegend}
                                rightLegend={rightLegend} processedData={processedData} colors={colors}
                                max={max * 1.05} keys={keys} getTooltipText={getTooltipText}
                                getTooltipHeader={getTooltipHeader} lineColor={barPieColor[1]}
                                legends={[{id: 1, 'color': barPieColor[0], 'label': 'Number of days for import'},
                                  {id: 2, 'color': barPieColor[1], 'label': 'Industry Rating'}
                                ]} lineChartField={'rating'} lineChartFieldLabel={'Industry Rating'}/>
      case PERFORMANCE_SEED_TRADERS:
        return <Grid.Row className={`chart-section`}>
          <Grid.Column width={16}>
            <ResponsiveRadarChartImpl
                noData={noData}
                selectedYear={selectedYear}
                processedData={processedData}
                keys={keys}
                colors={colors}
                indexBy={indexBy}
            /></Grid.Column>
        </Grid.Row>
      default:
        return (<Grid.Row className={`chart-section`}>
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
        </Grid.Row>);
    }
  }

  return <Grid className={`number-varieties-released`}>
    <Grid.Row className="header-section">
      <Grid.Column width={12}>
        <Header title={`${title}`} subtitle={subTitle} />
      </Grid.Column>
      <Grid.Column width={4}>
        <Export/>
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
        {legend === 'years' && <YearLegend colors={yearsColors} years={selectedYear} />}
      </Grid.Column>
      <Grid.Column width={8} className="withSeparator">
        {withCropsWithSpecialFeatures && <CropsWithSpecialFeatures />}
      </Grid.Column>
    </Grid.Row> : null}
    {insertChart()}
    <Grid.Row className={`source-section`}>
      <Grid.Column>
        <Source title={`Source: ${sources}${editing ? ` *${type}*` : ''}`} />
      </Grid.Column>
    </Grid.Row>
  </Grid>
}

const blueColors = [
  '#3377b6', '#7dafde', '#9fbfdc', '#c2dbf3'
];
const performanceColors = [
  '#4D843F', '#F39C00', '#FBCC2A', '#E36A6A', '#289DF5'
];
const barPieColor = [
  '#41a9d9', '#c2db24'
]

export default injectIntl(ChartComponent);
