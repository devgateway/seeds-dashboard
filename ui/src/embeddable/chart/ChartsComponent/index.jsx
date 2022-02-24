import ResponsiveBarChartImpl from "../ResponsiveBarChartImpl";
import React, {useRef, useState, useEffect} from "react";
import { Grid } from "semantic-ui-react";
import {toBlob} from 'html-to-image';
import {saveAs} from 'file-saver';
import Header from "../common/header";
import CropFilter from "../common/filters/crops";
import YearsFilter from "../common/filters/years";
import GenericLegend from "../common/generic";
import CropsLegend from "../common/crop";
import Export from "../common/export";
import CropsWithSpecialFeatures from "../common/cropWithSpecialFeatures";
import Source from "../common/source";
import { getColor } from "../Countryinfo/CountryInfoChart";
import {
  AVERAGE_AGE_VARIETIES_SOLD,
  MARKET_CONCENTRATION_HHI,
  PERFORMANCE_SEED_TRADERS,
  NUMBER_OF_ACTIVE_BREEDERS,
  NUMBER_OF_ACTIVE_SEED_COMPANIES_PRODUCERS,
  VARIETIES_RELEASED_WITH_SPECIAL_FEATURES,
  NUMBER_VARIETIES_SOLD,
  EFFICIENCY_SEED_IMPORT_PROCESS,
  EFFICIENCY_SEED_EXPORT_PROCESS,
  NUMBER_SEED_INSPECTORS,
  MARKET_SHARE_TOP_FOUR_SEED_COMPANIES,
  MARKET_SHARE_STATE_OWNED_SEED_COMPANIES,
  QUANTITY_CERTIFIED_SEED_SOLD,
  VARIETY_RELEASE_PROCESS,
  PRICE_SEED_PLANTING,
  AVAILABILITY_SEED_SMALL_PACKAGES,
  AGRODEALER_NETWORK,
  AGRICULTURAL_EXTENSION_SERVICES, NUMBER_SEED_INSPECTORS_BY_COUNTRY
} from "../../reducers/StoreConstants";
import YearLegend from "../common/year";
import MarketConcentrationHHI from "../MarketConcentrationHHI";
import ResponsiveRadarChartImpl from "../ResponsiveRadarChartImpl";
import { injectIntl } from "react-intl";
import BarAndLineChart from "../BarAndLineChart";
import {COUNTRY_OPTIONS} from "../../../countries";
import ResponsiveLineChartImpl from "../ResponsiveLineChartImpl";

const ChartComponent = ({ sources, data, type, title, subTitle, editing, intl, methodology, download, exportPng }) => {
  const [initialCrops, setInitialCrops] = useState(null);
  const [selectedCrops, setSelectedCrops] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const ref = useRef(null);
  const genericLegend = "generic";
  //TODO can be configured in wordpress at a later stage
  let indexBy = 'crop';
  let useFilterByYear = true;
  let layout = 'vertical';
  let groupMode = 'stacked';
  let lineChartField = 'rating';
  let lineChartFieldLabel = intl.formatMessage({id: 'industry-rating-legend', defaultMessage: 'Industry Rating'});
  let legends;
  let withCropsWithSpecialFeatures = true;
  let addLighterDiv = true;
  let leftLegend;
  let bottomLegend;
  let rightLegend;
  let enableGridX = false;
  let enableGridY = true;
  let legend = 'crops';
  let customTickWithCropsBottom = false;
  let customTickWithCropsLeft = false;
  let showTotalLabel = true;
  let showTotalMD = true;
  let legendTitle = "";
  let margins = null;
  //END TODO
  let getTooltipText;
  let getTooltipHeader;
  let crops = null;
  let noData = false;
  let years = null;
  let colors = new Map();
  let keys = [];
  let max = 0;
  let maxSelectableYear = 4;
  let processedData = [];
  let useCropLegendsRow = true;
  let useFilterByCrops = true;
  let yearsColors = blueColors;
  let dataSuffix = null;
  let containerHeight = null;
  let extraTooltipClass = null;
  let showMaxYearsMessage = false;
  let switchToLineChart = false;

  if (type === PERFORMANCE_SEED_TRADERS) {
    maxSelectableYear = 3;
    showMaxYearsMessage = true
  } else if (type === AVAILABILITY_SEED_SMALL_PACKAGES || type === VARIETIES_RELEASED_WITH_SPECIAL_FEATURES) {
    maxSelectableYear = 1;
  }

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
      if (years && years.length > maxSelectableYear) {
        setSelectedYear(years.slice(years.length - maxSelectableYear, years.length))
      } else {
        setSelectedYear(years)
      }

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


  const availabilitySeedSmallPackages = () => {
    let hasData = false;
    if (years && crops) {
      max = 85;
      data.dimensions.packages.values.forEach(x => keys.push(x));
      if (selectedYear) {
        crops.forEach(c => {
          const item = {crop: c};
          if (data.values[selectedYear][c]) {
            keys.forEach(k =>{
              item[k] = Number(data.values[selectedYear][c][k]) >= 0 
                  ? Math.round(data.values[selectedYear][c][k] * 1000) / 10 
                  : FAKE_NUMBER;
              if (item[k] !== FAKE_NUMBER) {
                hasData = true;
              }
              if (!colors.get(k)) {
                colors.set(k, packageBarColor[keys.indexOf(k)]);
              }
            });
          }
          processedData.push(item);
          noData = !hasData;
        });
      }
    }
  }

  const commonProcess = (c, entry, yearColors) => {
    const newBlueColors = yearColors ? [...yearColors] : null;
    Object.keys(data.values[c]).forEach((i, j) => {
      if (selectedYear && selectedYear.find(k => k === i)) {
        const key = '' + i;
        entry[key] = Number(data.values[c][i]) >= 0 ? data.values[c][i] : FAKE_NUMBER;

        // Change % to 100 scale.
        if (type === MARKET_SHARE_TOP_FOUR_SEED_COMPANIES || type === MARKET_SHARE_STATE_OWNED_SEED_COMPANIES) {
          entry[key] = Math.round(entry[key] * 100);
        }

        if (!keys.find(i => i === key)) {
          keys.push(key);
        }
        if (yearColors && newBlueColors) {
          if (!colors.get(key)) {
            colors.set(key, newBlueColors.shift());
          }
        }
        if (Number(entry[i]) > max) {
          max = Number(entry[i]);
        }
      }
    });
    processedData.push(entry);
  }

  const processInspectorsByCountry = () => {
    let auxData = [];
    Object.keys(data.values).forEach(i => {
      const entry = {
        country: COUNTRY_OPTIONS.find(j => j.flag.toLowerCase() === i.toLowerCase()).text,
        publicSeedInspectors: data.values[i].public,
        privateSeedInspectors: data.values[i].private,
        year: data.values[i].year,
        total: data.values[i].total,
      }
      auxData.push(entry);
      noData = false;

      if (entry.privateSeedInspectors > max) {
        max = entry.privateSeedInspectors;
      }
      if (entry.publicSeedInspectors > max) {
        max = entry.publicSeedInspectors;
      }
    });
    max = max * 0.95;
    auxData.sort((a, b) => b.country.localeCompare(a.country));
    auxData.forEach(i => {
      processedData.push(i);
    });
    colors.set('privateSeedInspectors', barPieColor[2]);
    colors.set('publicSeedInspectors', barPieColor[1]);
  }

  const processByYear = () => {
    crops.forEach(c => {
      const entry = { crop: c };
      commonProcess(c, entry);
    });

    // Fix missing data from the EP (crop without one or more years data).
    const newBlueColors = [...blueColors];
    processedData.forEach(p => {
      years.forEach(y => {
        if (!p[y]) {
          processedData.find(i => i.crop === p.crop)[y] = FAKE_NUMBER;
          // data.values[p.crop][y] = 'MD';
        }
        // Process color here to prevent SEEDSDT-583
        if (!colors.get(y)) {
          colors.set(y, newBlueColors.shift());
        }
      });
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
          sumWF = data.values[c][selectedYear].withspecialfeature || 0;
          sumWOF = data.values[c][selectedYear].withoutspecialfeature || 0;
        } else {
          Object.keys(data.values[c]).forEach(i => {
            sumWF += data.values[c][i].withspecialfeature || 0;
            sumWOF += data.values[c][i].withoutspecialfeature || 0;
          });
        }

        const key1 = 'withSpecialFeature_' + c;
        const key2 = 'withoutSpecialFeature_' + c;
        const header = {
          crop: intl.formatMessage({id: c, defaultMessage: c}),
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

  let subLabel = '';
  switch (type) {
    case NUMBER_VARIETIES_SOLD:
    case PRICE_SEED_PLANTING:
    case QUANTITY_CERTIFIED_SEED_SOLD:
    case AVERAGE_AGE_VARIETIES_SOLD:
    case MARKET_SHARE_TOP_FOUR_SEED_COMPANIES:
    case MARKET_SHARE_STATE_OWNED_SEED_COMPANIES:
    case NUMBER_OF_ACTIVE_SEED_COMPANIES_PRODUCERS: {
      customTickWithCropsBottom = true;
      leftLegend = intl.formatMessage({id: 'number-of-years', defaultMessage: 'Number of Years'});
      bottomLegend = intl.formatMessage({id: 'crops-years', defaultMessage: 'Crop > Year'});
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
            <div className="crop-name">{intl.formatMessage({id: d.indexValue, defaultMessage: d.indexValue})}</div>
          </>;
        }
        leftLegend = intl.formatMessage({id: 'number-of-varieties-sold', defaultMessage: 'Number of varieties sold'});
      } else if (type === AVERAGE_AGE_VARIETIES_SOLD) {
        leftLegend = intl.formatMessage({id: 'average-age', defaultMessage: 'Average age (years)'});
        bottomLegend = intl.formatMessage({id: 'crops-years', defaultMessage: 'Crop > Year'});
        getTooltipText = (d) => {
          return <>
            <span>{intl.formatMessage({id: 'tooltip-average-age', defaultMessage: 'Average Age'})}</span><span
              className="bold"> {d.data[d.id]}  </span><br/>
            <span>{intl.formatMessage({id: 'tooltip-year', defaultMessage: 'Year'})}</span><span
              className="bold"> {d.id}  </span>

          </>
        }
        getTooltipHeader = (d) => {
          return <>
            <div className={d.indexValue.toLowerCase() + " crop-icon"}/>
            <div className="crop-name">{intl.formatMessage({id: d.indexValue, defaultMessage: d.indexValue})}</div>
          </>;
        }
      } else if (type === PRICE_SEED_PLANTING) {
        leftLegend = intl.formatMessage({
          id: 'price-usd-by-kg',
          defaultMessage: 'Average price (USD/kg)'
        });
        getTooltipText = (d) => {
          return <>
            <span className="bold">{d.data[d.id]} </span>
            <span>{intl.formatMessage({
              id: 'tooltip-price-usd-by-kg',
              defaultMessage: '(usd/kg) of variety and year'
            })}</span>
          </>
        }
        getTooltipHeader = (d) => {
          return <>
            <div className={d.indexValue.toLowerCase() + " crop-icon"} />
            <div className="crop-name">{intl.formatMessage({
              id: d.indexValue,
              defaultMessage: d.indexValue
            })} {d.id}</div>
          </>;
        }
      } else if (type === MARKET_SHARE_TOP_FOUR_SEED_COMPANIES) {
        dataSuffix = '%';
        leftLegend = intl.formatMessage({
          id: 'market-share-top-companies',
          defaultMessage: 'Market share of top four companies (out of 100%)'
        });
        getTooltipText = (d) => {
          return <>
            <span>{intl.formatMessage({
              id: 'tooltip-market-share-top-companies',
              defaultMessage: 'Market share of top four companies'
            })}</span>
            <span className="bold"> {d.data[d.id]}%</span><br />
          </>
        }
        getTooltipHeader = (d) => {
          return <>
            <div className={d.indexValue.toLowerCase() + " crop-icon"} />
            <div className="crop-name">{intl.formatMessage({id: d.indexValue, defaultMessage: d.indexValue})}</div>
          </>;
        }
      } else if (type === MARKET_SHARE_STATE_OWNED_SEED_COMPANIES) {
        dataSuffix = '%';
        leftLegend = intl.formatMessage({
          id: 'market-share-state-owned',
          defaultMessage: 'Market share (out of 100%)'
        });
        getTooltipText = (d) => {
          return <>
            <span>{intl.formatMessage({
              id: 'tooltip-market-share-state-owned',
              defaultMessage: 'Market share of state owned companies'
            })}</span>
            <span className="bold"> {d.data[d.id]}%</span><br/>
          </>
        }
        getTooltipHeader = (d) => {
          return <>
            <div className={d.indexValue.toLowerCase() + " crop-icon"}/>
            <div className="crop-name">{intl.formatMessage({id: d.indexValue, defaultMessage: d.indexValue})}</div>
          </>;
        }
      } else if (type === QUANTITY_CERTIFIED_SEED_SOLD) {
        leftLegend = intl.formatMessage({
          id: 'metric-tons',
          defaultMessage: 'Metric tons'
        });
        getTooltipText = (d) => {
          return <>
            <span>{intl.formatMessage({
              id: 'tooltip-quantity-certified-seed-sold',
              defaultMessage: 'Quantity of certified seed sold'
            })}</span>
            <span className="bold"> {d.data[d.id]}</span><span> metric tons</span>
          </>
        }
        getTooltipHeader = (d) => {
          return <>
            <div className={d.indexValue.toLowerCase() + " crop-icon"} />
            <div className="crop-name">{intl.formatMessage({
              id: d.indexValue,
              defaultMessage: d.indexValue
            })} {d.id}</div>
          </>;
        }
      } else {
        leftLegend = intl.formatMessage({
          id: 'number-company-producers',
          defaultMessage: 'Number of companies / producers'
        });
        getTooltipText = (d) => {
          return <>
            <span
                className="bold"> {d.data[d.id]} </span>
            <span>seed companies / producers </span>

          </>
        }
        getTooltipHeader = (d) => {
          return <>
            <div className={d.indexValue.toLowerCase() + " crop-icon"} />
            <div className="crop-name">{intl.formatMessage({
              id: d.indexValue,
              defaultMessage: d.indexValue
            })} {d.id}</div>
          </>;
        }
      }
      legend = intl.formatMessage({id: 'years-legend', defaultMessage: 'Year'});
      groupMode = 'grouped';
      withCropsWithSpecialFeatures = false;
      processByYear();
      
      // Reprocess data and change to line chart.
      // TODO: move this code to a common function like processByYear().
      if (type === PRICE_SEED_PLANTING && selectedYear.length > 3) {
        console.log(processedData);
        switchToLineChart = true;
        const newProcessedData = [];
        keys = [];
        processedData.forEach((i, index) => {
          const item = {id: i.crop, color: getColor({id: i.crop}), data: []};
          Object.keys(processedData[index]).filter(k => k !== indexBy).forEach(j => {
            item.data.push({
              x: j,
              y: processedData[index][j]
            });
            if (!keys.find(k => k === j)) {
              keys.push(j);
            }
          });
          newProcessedData.push(item);
        });
        processedData = newProcessedData;
        console.log(processedData);
      }
      break;
    }
    case VARIETIES_RELEASED_WITH_SPECIAL_FEATURES:
      getTooltipText = (d) => {
        return <>
          <span
              className="bold"> {d.data[d.id]} out of {(d.data['withSpecialFeature_' + d.indexValue.toLowerCase()] || 0)
          + (d.data['withoutSpecialFeature_' + d.indexValue.toLowerCase()] || 0)} </span>
          <span>varieties released {d.id.startsWith('withSpecial')
              ? (<>with <span className="bold">special features</span></>)
              : <>without <span className="bold">special features</span></>}</span>
        </>
      }
      getTooltipHeader = (d) => {
        return <>
          <div className={d.indexValue.toLowerCase() + " crop-icon"} />
          <div className="crop-name">{intl.formatMessage({
            id: d.indexValue,
            defaultMessage: d.indexValue
          })} {selectedYear}</div>
        </>
      }
      leftLegend = intl.formatMessage({id: 'number-of-varieties-released', defaultMessage: 'Number of Varieties Released'});
      bottomLegend = intl.formatMessage({id: 'crops-legend', defaultMessage: 'Crop'});
      processVarietiesReleasedWithSpecialFeatures();
      break;
    case NUMBER_SEED_INSPECTORS_BY_COUNTRY:
      getTooltipHeader = (d) => {
        return <div className="country-header">{`${d.data.country} ${d.data.year}`}</div>
      }
      getTooltipText = (d) => {
        return (<>
          <span>{intl.formatMessage({id: 'tooltip-public-inspectors-legend', defaultMessage: 'Public seed inspectors'})} </span>
          <span className="bold"> {d.data.publicSeedInspectors || 0}</span>
          <br/>
          <span>{intl.formatMessage({id: 'tooltip-private-inspectors-legend', defaultMessage: 'Private seed inspectors'})} </span>
          <span className="bold"> {d.data.privateSeedInspectors || 0}</span>
          <br/>
          <span>{intl.formatMessage({id: 'tooltip-total-inspectors-legend', defaultMessage: 'Total seed inspectors'})} </span>
          <span className="bold"> {d.data.total || 0}</span>
        </>);
      }
      indexBy = 'country';
      leftLegend = intl.formatMessage({id: 'countries', defaultMessage: 'Countries'});
      layout = 'horizontal';
      bottomLegend = intl.formatMessage({
        id: 'number-seed-inspectors-legend',
        defaultMessage: 'Number of seed inspectors'
      });
      enableGridX = true;
      enableGridY = false;
      groupMode='stacked';
      keys.push('publicSeedInspectors', 'privateSeedInspectors');
      useFilterByCrops = false;
      useFilterByYear = false;
      addLighterDiv = false;
      withCropsWithSpecialFeatures = false;
      useCropLegendsRow = true;
      legend = genericLegend;
      legendTitle = '';
      containerHeight = 650;
      processInspectorsByCountry();
      break;
    case NUMBER_OF_ACTIVE_BREEDERS:
      getTooltipHeader = (d) => {
        const cropName = d.id.replace(`${d.indexValue}_`, "");
        return <>
          <div className={`${cropName} crop-icon`} />
          <div className="crop-name">{`${intl.formatMessage({
            id: cropName,
            defaultMessage: cropName
          })} ${d.indexValue}`}</div>
        </>
      }
      getTooltipText = (d) => {
        return <><span
            className="bold"> {d.data[d.id]}  </span>
          <span>active breeders.</span>
        </>
      }
      useFilterByYear = false;
      indexBy = 'year';
      leftLegend = intl.formatMessage({id: 'years-legend', defaultMessage: 'Year'});
      layout = 'horizontal';
      addLighterDiv = false;
      withCropsWithSpecialFeatures = false;
      bottomLegend = intl.formatMessage({id: 'number-of-breeders-legend', defaultMessage: 'Number of Breeders'});
      enableGridX = true;
      enableGridY = false;
      numberOfActiveBreeders();
      break;
    case AVAILABILITY_SEED_SMALL_PACKAGES:
      getTooltipHeader = (d) => {
        return <>
          <div className={`${d.indexValue} crop-icon`} />
          <div className="crop-name">{intl.formatMessage({
            id: d.indexValue,
            defaultMessage: d.indexValue
          })} {selectedYear}</div>
        </>
      }
      getTooltipText = (d) => {
        const packageName = d.id.replace(`${d.indexValue}_`, "");
        return <>
          <div><span>{intl.formatMessage({id: 'package-size-tooltip', defaultMessage: 'Package size'})}: </span>
            <span className="bold">{intl.formatMessage({id: packageName + '-tooltip', defaultMessage: packageName})}</span></div>
          <div><span>{intl.formatMessage({id: 'percentage-legend', defaultMessage: 'Percentage'})}: </span>
            <span className="bold"> {d.data[d.id]}</span></div>
        </>
      }
      indexBy = 'crop';
      leftLegend = intl.formatMessage({id: 'crops-legend', defaultMessage: 'Crop'});
      layout = 'horizontal';
      addLighterDiv = false;
      withCropsWithSpecialFeatures = false;
      useFilterByYear = true;
      useFilterByCrops = false;
      showTotalLabel = false;
      showTotalMD = true;
      bottomLegend = intl.formatMessage({id: 'percentage-legend', defaultMessage: 'Percentage (%)'});
      enableGridX = true;
      enableGridY = false;
      customTickWithCropsLeft = true;
      legend = genericLegend;
      legendTitle = intl.formatMessage({id: 'package-size-legend', defaultMessage: 'Package Sizes'});
      margins = {top: 50, right: 60, bottom: 70, left: 160}
      availabilitySeedSmallPackages();
      break;
    case MARKET_CONCENTRATION_HHI:
      useCropLegendsRow = false;
      useFilterByCrops = false;
      bottomLegend = intl.formatMessage({id: 'years-legend', defaultMessage: 'Year'});
      break;
    case PERFORMANCE_SEED_TRADERS:
      indexBy = "id";
      legend = "year";
      useFilterByCrops = false;
      useFilterByYear = true;
      maxSelectableYear = 3;
      withCropsWithSpecialFeatures = false;
      yearsColors = performanceColors;
      processForRadar(data.dimensions.performance.values)
      break;
    case EFFICIENCY_SEED_IMPORT_PROCESS:
    case EFFICIENCY_SEED_EXPORT_PROCESS:
      useCropLegendsRow = false;
      useFilterByCrops = false;
      let tooltipSubText = '';
      switch (type) {
        case EFFICIENCY_SEED_IMPORT_PROCESS:
          leftLegend = 'Length of import process (days)';
          tooltipSubText = 'Days for Import';
          subLabel = 'Length of import process (days)';
          legends = [{id: 1, 'color': barPieColor[1], 'label': 'Number of days for import'},
            {id: 2, 'color': barPieColor[0], 'label': 'Industry rating'}
          ];
          break;
        case EFFICIENCY_SEED_EXPORT_PROCESS:
          leftLegend = 'Length of export process (days)';
          tooltipSubText = 'Number of days';
          subLabel = 'Length of export process (days)';
          legends = [{id: 1, 'color': barPieColor[1], 'label': 'Number of days for export'},
            {id: 2, 'color': barPieColor[0], 'label': 'Industry rating'}
          ];
          break;
        default:
          leftLegend = 'insert legend here';
      }
      indexBy = 'year';
      bottomLegend = 'Year';
      groupMode = 'grouped';
      rightLegend = 'Rating out of 100';
      keys.push(['value']);
      Object.keys(data.values.days).forEach(y => {
        const item = {year: y};
        if (selectedYear && selectedYear.find(k => k === y)) {
          item.value = Number(data.values.days[y].days) >= 0 ? data.values.days[y].days : FAKE_NUMBER;
          item.rating = Number(data.values.rating[y].rating) >= 0 ? data.values.rating[y].rating : FAKE_NUMBER;
          if (item.value > max) {
            max = item.value;
          }
          processedData.push(item);
        }
      });
      colors.set('value', barPieColor[1])
      getTooltipText = (d) => {
        return <div style={{textAlign: 'center'}}>
          <span>{tooltipSubText}</span>
          <span className="bold"> {d.data[d.id] !== FAKE_NUMBER ? d.data[d.id] : 'MD'}</span>
        </div>
      }
      getTooltipHeader = (d) => {
        return <>
          <div className={d.indexValue + " crop-icon"}/>
          <div className="crop-name">{intl.formatMessage({id: d.indexValue, defaultMessage: d.indexValue})}</div>
        </>;
      }
      break;
    case NUMBER_SEED_INSPECTORS:
      useCropLegendsRow = false;
      useFilterByCrops = false;
      leftLegend = intl.formatMessage({id: 'number-seed-inspectors-legend', defaultMessage: 'Number of seed inspectors'});
      indexBy = 'year';
      bottomLegend = intl.formatMessage({id: 'years-legend', defaultMessage: 'Year'});
      groupMode = 'stacked';
      rightLegend = intl.formatMessage({id: 'rating-legend', defaultMessage: 'Rating out of 100'});
      keys.push('public', 'private');
      Object.keys(data.values).forEach(y => {
        const item = {year: y};
        if (selectedYear && selectedYear.find(k => k === y)) {
          item.public = Number(data.values[y].public) >= 0 ? data.values[y].public : FAKE_NUMBER;
          item.private = Number(data.values[y].private) >= 0 ? data.values[y].private : FAKE_NUMBER;
          item.rating = Number(data.values[y].rating) >= 0 ? data.values[y].rating : FAKE_NUMBER;
          item.total = Number(data.values[y].total) || 0;
          if (item.total > max) {
            max = item.total;
          }
          processedData.push(item);
        }
      });
      colors.set('public', barPieColor[1])
      colors.set('private', barPieColor[2])
      getTooltipText = (d) => {
        const private_ = processedData.find(i => Number(i.year) === Number(d.data.year)).private;
        const public_ = processedData.find(i => Number(i.year) === Number(d.data.year)).public;
        return <><div style={{textAlign: 'center'}}>
          <span>{intl.formatMessage({id: 'tooltip-private-inspectors-legend', defaultMessage: 'Private seed inspectors'})} </span>
          <span className="bold"> {private_ !== FAKE_NUMBER ? private_ : 'MD'}</span>
        </div>
          <div style={{textAlign: 'center'}}>
            <span>{intl.formatMessage({id: 'tooltip-public-inspectors-legend', defaultMessage: 'Public seed inspectors'})} </span>
            <span className="bold"> {public_ !== FAKE_NUMBER ? public_ : 'MD'}</span>
          </div>
        </>
      }
      getTooltipHeader = (d) => {
        return <>
          <div className={d.indexValue + " crop-icon"}/>
          <div className="crop-name">{intl.formatMessage({id: d.indexValue, defaultMessage: d.indexValue})}</div>
        </>;
      }
      legends = [{id: 1, 'color': barPieColor[1], 'label': intl.formatMessage({id: 'public-inspectors-legend', defaultMessage: 'Public inspectors'})},
        {id: 2, 'color': barPieColor[2], 'label': intl.formatMessage({id: 'private-inspectors-legend', defaultMessage: 'Private inspectors'})},
        {id: 3, 'color': barPieColor[0], 'label': intl.formatMessage({id: 'industry-opinion-legend', defaultMessage: 'Industry opinion rating (adequacy) (out of 100%)'})}
      ];
      showTotalLabel=true;
      lineChartFieldLabel = intl.formatMessage({id: 'industry-opinion-legend-tooltip', defaultMessage: 'Industry opinion rating'});
      break;
    case VARIETY_RELEASE_PROCESS:
      useCropLegendsRow = false;
      useFilterByCrops = false;
      useFilterByYear = false;
      leftLegend = intl.formatMessage({
        id: 'number-months-axis',
        defaultMessage: 'Length of variety release process (months)'
      });
      indexBy = 'year';
      bottomLegend = intl.formatMessage({id: 'years-legend', defaultMessage: 'Year'});
      groupMode = 'stacked';
      rightLegend = intl.formatMessage({id: 'rating-legend', defaultMessage: 'Rating out of 100'});
      keys.push('time');
      Object.keys(data.values).forEach(y => {
        const item = {year: y};
        if (selectedYear && selectedYear.find(k => k === y)) {
          item.time = Number(data.values[y].time) >= 0 ? data.values[y].time : FAKE_NUMBER;
          item.satisfaction = Number(data.values[y].satisfaction) >= 0 ? data.values[y].satisfaction : FAKE_NUMBER;
          if (item.time > max) {
            max = item.time;
          }
          processedData.push(item);
        }
      });
      lineChartField = 'satisfaction';
      lineChartFieldLabel = intl.formatMessage({id: 'satisfaction-release-tooltip', defaultMessage: 'Satisfaction with variety release'});
      colors.set('time', barPieColor[1])
      getTooltipText = (d) => {
        return <><div style={{textAlign: 'center'}}>
          <span>{intl.formatMessage({id: 'number-months-tooltip', defaultMessage: 'Length of variety release process (months)'})} </span>
          <span className="bold"> {d.data.time !== FAKE_NUMBER ? d.data.time : "MD"}</span>
        </div></>
      }
      getTooltipHeader = (d) => {
        return <>
          <div className={d.indexValue + " crop-icon"}/>
          <div className="crop-name">{intl.formatMessage({id: d.indexValue, defaultMessage: d.indexValue})}</div>
        </>;
      }
      legends = [{
        id: 1,
        'color': barPieColor[1],
        'label': intl.formatMessage({id: 'number-months-legend', defaultMessage: 'Length of variety release process'})
      },
        {
          id: 3,
          'color': barPieColor[0],
          'label': intl.formatMessage({
            id: 'satisfaction-release-legend',
            defaultMessage: 'Satisfaction with variety release (out of 100%)'
          })
        }
      ];
      break;
    case AGRODEALER_NETWORK:
      useCropLegendsRow = false;
      useFilterByCrops = false;
      leftLegend = intl.formatMessage({id: 'number-households-legend', defaultMessage: 'Number of households"'});
      indexBy = 'year';
      bottomLegend = intl.formatMessage({id: 'years-legend', defaultMessage: 'Year'});
      groupMode = 'stacked';
      rightLegend = intl.formatMessage({id: 'rating-legend', defaultMessage: 'Rating out of 100'});
      keys.push('households');
      Object.keys(data.values).forEach(y => {
        const item = {year: y};
        if (selectedYear && selectedYear.find(k => k === y)) {
          item.households = Number( data.values[y].households) >= 0 ?  data.values[y].households : FAKE_NUMBER;
          item.agrodealers = Number( data.values[y]["agrodealers-number"]) >= 0 ?  data.values[y]["agrodealers-number"] : FAKE_NUMBER;
          item.rating = Number( data.values[y].rating) >= 0 ?  data.values[y].rating : FAKE_NUMBER;
          if (item.households > max) {
            max = item.households;
          }
          processedData.push(item);
        }
      });
      lineChartField = 'rating';
      lineChartFieldLabel = intl.formatMessage({id: 'industry-opinion-rating-legend', defaultMessage: 'Industry opinion rating'});
      colors.set('households', barPieColor[1])
      getTooltipText = (d) => {
        return <><div style={{textAlign: 'center'}}>
          <span>{intl.formatMessage({id: 'agricultural-households-tooltip', defaultMessage: 'Agricultural households/agro-dealer'})} </span>
          <span className="bold"> {d.data.households !== FAKE_NUMBER ? d.data.households : "MD"}</span>
        </div><div style={{textAlign: 'center'}}>
          <span>{intl.formatMessage({id: 'number-agrodealers-tooltip', defaultMessage: 'Number of agro-dealers'})} </span>
          <span className="bold"> {d.data.agrodealers !== FAKE_NUMBER ? d.data.agrodealers : "MD"}</span>
        </div></>
      }
      getTooltipHeader = (d) => {
        return <>
          <div className={d.indexValue + " crop-icon"}/>
          <div className="crop-name">{intl.formatMessage({id: d.indexValue, defaultMessage: d.indexValue})}</div>
        </>;
      }
      legends = [{
        id: 1,
        'color': barPieColor[1],
        'label': intl.formatMessage({
          id: 'agricultural-households-tooltip',
          defaultMessage: 'Agricultural households/agro-dealer'
        })
      },
        {
          id: 2,
          'color': barPieColor[0],
          'label': intl.formatMessage({
            id: 'concentration-rating-legend',
            defaultMessage: 'Industry opinion rating (adequacy) (out of 100%)'
          })
        }
      ];
      break;
    case AGRICULTURAL_EXTENSION_SERVICES:
      useCropLegendsRow = false;
      useFilterByCrops = false;
      leftLegend = intl.formatMessage({id: 'number-households-legend', defaultMessage: 'Number of households"'});
      indexBy = 'year';
      bottomLegend = intl.formatMessage({id: 'years-legend', defaultMessage: 'Year'});
      groupMode = 'stacked';
      rightLegend = intl.formatMessage({id: 'rating-legend', defaultMessage: 'Rating out of 100'});
      keys.push('households');
      Object.keys(data.values).forEach(y => {
        const item = {year: y};
        if (selectedYear && selectedYear.find(k => k === y)) {
          item.households = Number( data.values[y].households) >= 0 ?  data.values[y].households : FAKE_NUMBER;
          item.rating = Number( data.values[y].rating) >= 0 ?  data.values[y].rating : FAKE_NUMBER;
          if (item.households > max) {
            max = item.households;
          }
          processedData.push(item);
        }
      });
      lineChartField = 'rating';
      lineChartFieldLabel = intl.formatMessage({id: 'industry-opinion-rating-legend', defaultMessage: 'Industry opinion rating'});
      colors.set('households', barPieColor[1])
      getTooltipText = (d) => {
        return <><div style={{textAlign: 'center'}}>
          <span>{intl.formatMessage({id: 'households-per-officer-tooltip', defaultMessage: 'Households per extension officer'})} </span>
          <span className="bold"> {d.data.households !== FAKE_NUMBER ? d.data.households : "MD"}</span>
        </div></>
      }
      getTooltipHeader = (d) => {
        return <>
          <div className={d.indexValue + " crop-icon"}/>
          <div className="crop-name">{intl.formatMessage({id: d.indexValue, defaultMessage: d.indexValue})}</div>
        </>;
      }
      legends = [{
        id: 1,
        'color': barPieColor[1],
        'label': intl.formatMessage({
          id: 'households-per-officer-tooltip',
          defaultMessage: 'Households per extension officer'
        })
      },
        {
          id: 2,
          'color': barPieColor[0],
          'label': intl.formatMessage({
            id: 'availability-rating-legend',
            defaultMessage: 'Industry opinion rating (adequacy) (out of 100%)'
          })
        }
      ];
      extraTooltipClass = 'AGRICULTURAL_EXTENSION_SERVICES';
      break;
  }

  const insertChart = () => {
    switch (type) {
      case MARKET_CONCENTRATION_HHI:
        return <MarketConcentrationHHI data={data} selectedYear={selectedYear} bottomLegend={bottomLegend} intl={intl}/>
      case NUMBER_SEED_INSPECTORS:
      case VARIETY_RELEASE_PROCESS:
      case AGRODEALER_NETWORK:
      case AGRICULTURAL_EXTENSION_SERVICES:
      case EFFICIENCY_SEED_IMPORT_PROCESS:
      case EFFICIENCY_SEED_EXPORT_PROCESS:
        return <BarAndLineChart data={data} selectedYear={selectedYear} leftLegend={leftLegend}
                                indexBy={indexBy} groupMode={groupMode} bottomLegend={bottomLegend}
                                rightLegend={rightLegend} processedData={processedData} colors={colors}
                                max={max} keys={keys} getTooltipText={getTooltipText}
                                getTooltipHeader={getTooltipHeader} lineColor={barPieColor[0]}
                                legends={legends} lineChartField={lineChartField}
                                lineChartFieldLabel={lineChartFieldLabel}
                                showTotalLabel={showTotalLabel} extraTooltipClass={extraTooltipClass} intl={intl}
        />
      case PERFORMANCE_SEED_TRADERS:
        return <Grid.Row className={`chart-section`}>
          <Grid.Column width={16} className={`radar`}>
            <ResponsiveRadarChartImpl
                noData={noData}
                selectedYear={selectedYear}
                processedData={processedData}
                keys={keys}
                colors={colors}
                indexBy={indexBy}
                intl={intl}
            /></Grid.Column>
        </Grid.Row>
      default:
        return (<Grid.Row className={`chart-section`}>
          <Grid.Column width={16}>
            {!switchToLineChart ? <ResponsiveBarChartImpl sources={sources} data={data} noData={noData} crops={crops}
                                    selectedYear={selectedYear} colors={colors} max={max * 1.1} keys={keys}
                                    processedData={processedData} indexBy={indexBy} layout={layout}
                                    groupMode={groupMode}
                                    leftLegend={leftLegend} bottomLegend={bottomLegend}
                                    enableGridX={enableGridX} enableGridY={enableGridY}
                                    getTooltipText={getTooltipText} getTooltipHeader={getTooltipHeader}
                                    customTickWithCropsBottom={customTickWithCropsBottom}
                                    customTickWithCropsLeft={customTickWithCropsLeft}
                                    dataSuffix={dataSuffix}
                                    showTotalLabel={showTotalLabel} containerHeight={containerHeight || 450}
                                    showTotalMD={showTotalMD} margins={margins}
                                    intl={intl}
            /> : <ResponsiveLineChartImpl sources={sources} 
                                          data={data} 
                                          noData={noData} 
                                          crops={crops}
                                          selectedYear={selectedYear} 
                                          colors={colors} 
                                          max={max * 1.1} 
                                          keys={keys}
                                          processedData={processedData}
                                          indexBy={indexBy} 
                                          layout={layout}
                                          groupMode={groupMode}
                                          leftLegend={leftLegend} 
                                          bottomLegend={bottomLegend}
                                          enableGridX={enableGridX} 
                                          enableGridY={enableGridY}
                                          getTooltipText={getTooltipText} 
                                          getTooltipHeader={getTooltipHeader}
                                          customTickWithCropsBottom={customTickWithCropsBottom}
                                          customTickWithCropsLeft={customTickWithCropsLeft}
                                          dataSuffix={dataSuffix}
                                          showTotalLabel={showTotalLabel} 
                                          containerHeight={containerHeight || 450}
                                          showTotalMD={showTotalMD} 
                                          margins={margins}
                                          intl={intl}
            />}
          </Grid.Column>
        </Grid.Row>);
    }
  }

  let initialSelectedCrops = null;
  if (!noData && initialCrops && Array.from(initialCrops).length > 0) {
    initialSelectedCrops = [];
    initialCrops.forEach(i => {
      initialSelectedCrops.push(1);
    });
  }

  return (<div ref={ref}>
    <Grid className={`number-varieties-released`}>
      <Grid.Row className="header-section">
        <Grid.Column width={12}>
          <Header title={`${title}`} subtitle={subTitle}/>
        </Grid.Column>
        <Grid.Column width={4}>
          <Export methodology={methodology} exportPng={exportPng} download={download} containerRef={ref} type={'bar'}/>
        </Grid.Column>
      </Grid.Row>
      {useFilterByCrops || useFilterByYear ? <Grid.Row className={`filters-section`}>
        {!noData && useFilterByCrops ? <Grid.Column computer={3} mobile={16}>
          <CropFilter data={initialCrops} onChange={handleCropFilterChange}
                      initialSelectedCrops={initialSelectedCrops} intl={intl}/>
        </Grid.Column> : null}
        {(!noData && useFilterByYear) ? <Grid.Column computer={3} mobile={16}>
          <YearsFilter data={years} onChange={handleYearFilterChange} maxSelectable={maxSelectableYear}
                 defaultSelected={selectedYear} showMaxYearsMessage={showMaxYearsMessage}/>
        </Grid.Column> : null}
      </Grid.Row> : null}
      {!noData && useCropLegendsRow ? <Grid.Row className={`crops-with-icons`}>
        <Grid.Column width={8}>
          {legend === 'crops' &&
          <CropsLegend data={selectedCrops} title="Crops" titleClass="crops-title" addLighterDiv={addLighterDiv}
                       intl={intl}/>}
          {legend && legend.toLowerCase() === 'year' && <YearLegend colors={yearsColors} years={selectedYear}/>}
          {legend && legend === genericLegend && <GenericLegend colors={colors} keys={keys} title={legendTitle}/>}
        </Grid.Column>
        <Grid.Column width={8}>
          {withCropsWithSpecialFeatures && <CropsWithSpecialFeatures/>}
        </Grid.Column>
      </Grid.Row> : null}
      {insertChart()}
      <Grid.Row className={`source-section`}>
        <Grid.Column>
          <Source title={`Source: ${sources}${editing ? ` *${type}*` : ''}`}/>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>);
}

const blueColors = [
  '#3377b6', '#7dafde', '#9fbfdc', '#c2dbf3'
];
const performanceColors = [
  '#4D843F', '#F39C00', '#E36A6A', '#289DF5', '#FBCC2A'
];
const barPieColor = [
  '#c2db24', '#41a9d9', '#43758D'
];
const packageBarColor = [
  '#9D9D9D', '#F2CA05', '#EE912B', '#85AA2B', '#5F92C1'
];

export const FAKE_NUMBER = 0.001;

export default injectIntl(ChartComponent);
