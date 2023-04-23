import ResponsiveBarChartImpl from "../ResponsiveBarChartImpl";
import React, { useEffect, useRef, useState } from "react";
import { Grid } from "semantic-ui-react";
import Header from "../common/header";
import CropFilter from "../common/filters/crops";
import YearsFilter from "../common/filters/years";
import GenericLegend from "../common/generic";
import CropsLegend from "../common/crop";
import Export from "../common/export";
import CropsWithSpecialFeatures from "../common/cropWithSpecialFeatures";
import Source from "../common/source";
import { baseColors, getColor } from "../Countryinfo/CountryInfoChart";
import {
    AVERAGE_AGE_VARIETIES_SOLD,
    MARKET_CONCENTRATION_HHI,
    PERFORMANCE_SEED_TRADERS,
    RATING_GOVERNMENT_SEED_SUBSIDY_PROGRAM,
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
    AGRICULTURAL_EXTENSION_SERVICES,
    CROSS_COUNTRY_NUMBER_SEED_INSPECTORS,
    NUMBER_OF_VARIETIES_RELEASED,
    SHARE_CROPS,
    SHARE_CHART, SHARE_YEARS,
    CROSS_COUNTRY_NUMBER_OF_ACTIVE_BREEDERS,
    CROSS_COUNTRY_NUMBER_OF_VARIETIES_RELEASED,
    CROSS_COUNTRY_QUANTITY_CERTIFIED_SEED_SOLD,
    CROSS_COUNTRY_NUMBER_OF_ACTIVE_SEED_COMPANIES,
    CROSS_COUNTRY_NUMBER_VARIETIES_SOLD,
    CROSS_COUNTRY_MARKET_SHARE_TOP_FOUR_SEED_COMPANIES,
    CROSS_COUNTRY_MARKET_CONCENTRATION_HHI,
    CROSS_COUNTRY_MARKET_SHARE_STATE_OWNED_SEED_COMPANIES,
    CROSS_COUNTRY_VARIETY_RELEASE_PROCESS,
    CROSS_COUNTRY_OVERALL_RATING_NATIONAL_SEED_TRADE_ASSOCIATION,
    CROSS_COUNTRY_AGRODEALER_NETWORK, CROSS_COUNTRY_AVAILABILITY_SEED_SMALL_PACKAGES,
    CROSS_COUNTRY_AGRICULTURAL_EXTENSION_SERVICES
} from "../../reducers/StoreConstants";
import YearLegend from "../common/year";
import MarketConcentrationHHI, { getColorHHI, hhiLegends } from "../MarketConcentrationHHI";
import ResponsiveRadarChartImpl from "../ResponsiveRadarChartImpl";
import { injectIntl } from "react-intl";
import BarAndLineChart from "../BarAndLineChart";
import { COUNTRY_OPTIONS } from "../../../countries";
import ResponsiveLineChartImpl from "../ResponsiveLineChartImpl";
import Gauge from "../GaugesChart/components/Gauge";
import { range } from "../GaugesChart/components/common";
import { connect } from "react-redux";
import CrossCountryCropFilter from "../common/filters/crossCountry/crops";
import CrossCountryCountryFilter from "../common/filters/crossCountry/country";
import HHILegend from "../MarketConcentrationHHI/HHILegend";
import { normalizeField } from "../../utils/common";
import Notes from "../common/source/Notes";

export const MD = 'MD';

const ChartComponent = ({
                            sources,
                            data,
                            type,
                            title,
                            subTitle,
                            editing,
                            intl,
                            methodology,
                            download,
                            exportPng,
                            filters,
                            categoriesWP
                        }) => {
    const [initialCrops, setInitialCrops] = useState(null);
    const [selectedCrops, setSelectedCrops] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [currentData, setCurrentData] = useState(null);
    const [countries, setCountries] = useState([]);
    const [forceUpdate, setForceUpdate] = useState(false);
    const [hasNotes, setHasNotes] = useState(false)
    const ref = useRef(null);
    const genericLegend = "generic";
    let categoryType;
    if (categoriesWP) {
        categoryType = categoriesWP.find(c => c.slug === type.toLowerCase())
    }

    //TODO can be configured in wordpress at a later stage
    let defaultFormat = { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 1 };
    let indexBy = 'crop';
    let radarTooltip;
    let useFilterByYear = true;
    let layout = 'vertical';
    let groupMode = 'stacked';
    let lineChartField = 'rating';
    let lineChartFieldLabel = intl.formatMessage({ id: 'industry-rating-legend', defaultMessage: 'Industry Rating' });
    let legends;
    let withCropsWithSpecialFeatures = true;
    let addLighterDiv = true;
    let leftLegend;
    let bottomLegend;
    let lineTooltip;
    let rightLegend;
    let enableGridX = false;
    let enableGridY = true;
    let legend = 'crops';
    let customTickWithCropsBottom = false;
    let customTickWithCropsLeft = false;
    let totalLabel = { show: true, format: defaultFormat };
    let showTotalMD = true;
    let legendTitle = "";
    let margins = null;
    let noDataLabelId = "no-data";
    //END TODO
    let getTooltipText;
    let getTooltipHeader;
    let crops = null;
    let noData = false;
    let years = null;
    let colors = new Map();
    let getColors = null;
    const keys = [];
    let max = 0;
    let lineTooltipSuffix;
    let maxSelectableYear = 4;
    let maxSelectableCountries = 0;
    let processedData = [];
    let useCropLegendsRow = true;
    let useFilterByCrops = true;
    let yearsColors = barColors;
    let dataSuffix = null;
    let containerHeight = null;
    let animate = true
    let extraTooltipClass = null;
    let showMaxYearsMessage = false;
    let showMaxCountriesMessage = false;
    let switchToLineChart = false;
    let sharedCrops;
    let sharedYears;
    let isCrossCountryChart = false;
    let useHHILegends = false;
    let useFilterByCropsWithCountries = false;
    let useFilterByCountries = false;
    let customSorting = null;
    const MAIZE = 'maize';
    let customCrossCountryLegend = null;

    if (filters && filters.get(SHARE_CHART) === type) {
        if (filters.get(SHARE_CROPS)) {
            sharedCrops = filters.get(SHARE_CROPS).split(",");
        }
        if (filters.get(SHARE_YEARS)) {
            sharedYears = filters.get(SHARE_YEARS).split(",");
        }
    }
    if (type === PERFORMANCE_SEED_TRADERS) {
        maxSelectableYear = 3;
        showMaxYearsMessage = true
    } else if (type === RATING_GOVERNMENT_SEED_SUBSIDY_PROGRAM) {
        showMaxCountriesMessage = true;
    } else if (type === AVAILABILITY_SEED_SMALL_PACKAGES || type === VARIETIES_RELEASED_WITH_SPECIAL_FEATURES) {
        maxSelectableYear = 1;
    }

    if (type === CROSS_COUNTRY_NUMBER_OF_ACTIVE_BREEDERS || type === CROSS_COUNTRY_NUMBER_OF_VARIETIES_RELEASED
        || type === CROSS_COUNTRY_QUANTITY_CERTIFIED_SEED_SOLD
        || type === CROSS_COUNTRY_NUMBER_OF_ACTIVE_SEED_COMPANIES
        || type === CROSS_COUNTRY_NUMBER_VARIETIES_SOLD
        || type === CROSS_COUNTRY_MARKET_SHARE_TOP_FOUR_SEED_COMPANIES
        || type === CROSS_COUNTRY_MARKET_CONCENTRATION_HHI
        || type === CROSS_COUNTRY_MARKET_SHARE_STATE_OWNED_SEED_COMPANIES
        || type === CROSS_COUNTRY_VARIETY_RELEASE_PROCESS
        || type === CROSS_COUNTRY_OVERALL_RATING_NATIONAL_SEED_TRADE_ASSOCIATION
        || type === CROSS_COUNTRY_AGRODEALER_NETWORK
        || type === CROSS_COUNTRY_NUMBER_SEED_INSPECTORS
        || type === CROSS_COUNTRY_AVAILABILITY_SEED_SMALL_PACKAGES
        || type === CROSS_COUNTRY_AGRICULTURAL_EXTENSION_SERVICES
        || type === RATING_GOVERNMENT_SEED_SUBSIDY_PROGRAM) {
        isCrossCountryChart = true;
    }

    if (!data ||
        !data.dimensions ||
        (!data.dimensions.crop && !data.dimensions.year
            && type !== CROSS_COUNTRY_VARIETY_RELEASE_PROCESS && type !== CROSS_COUNTRY_OVERALL_RATING_NATIONAL_SEED_TRADE_ASSOCIATION
            && type !== CROSS_COUNTRY_AGRODEALER_NETWORK && type !== CROSS_COUNTRY_NUMBER_SEED_INSPECTORS
            && type !== CROSS_COUNTRY_AGRICULTURAL_EXTENSION_SERVICES && type !== RATING_GOVERNMENT_SEED_SUBSIDY_PROGRAM
            && type !== CROSS_COUNTRY_NUMBER_OF_ACTIVE_SEED_COMPANIES) ||
        data.id === null) {
        noData = true;
    } else {
        years = data.dimensions.year ? data.dimensions.year.values : {};
        crops = data.dimensions.crop ? data.dimensions.crop.values : {};

        // To prevent infinite loop.
        if (isCrossCountryChart && countries.length === 0) {
            let countriesISO = data.dimensions.country ? data.dimensions.country.values : [];
            countriesISO.forEach(c => {
                const countryName = COUNTRY_OPTIONS.find(j => j.flag.toLowerCase() === c.toLowerCase()).text
                const translatedName = intl.formatMessage({
                    id: normalizeField(countryName),
                    defaultMessage: countryName
                });
                countries.push({
                    iso: c, name: translatedName,
                    active: true, selected: true
                });
            });
            setCountries(countries.sort((a, b) => b.name.localeCompare(a.name)));
        } else if (forceUpdate) {
            setForceUpdate(false);
            setCountries(countries);
        }

        if (data !== currentData) {
            setCurrentData(data);
            if (sharedCrops) {
                setSelectedCrops(sharedCrops);
            } else {
                setSelectedCrops(crops);
            }
            setInitialCrops(crops);
            if (sharedYears) {
                setSelectedYear(sharedYears)
            } else {
                if (years && years.length > maxSelectableYear) {
                    setSelectedYear(years.slice(years.length - maxSelectableYear, years.length))
                } else {
                    setSelectedYear(years)
                }
            }
            if (type === CROSS_COUNTRY_NUMBER_OF_ACTIVE_BREEDERS
                || type === CROSS_COUNTRY_NUMBER_OF_VARIETIES_RELEASED
                || type === CROSS_COUNTRY_QUANTITY_CERTIFIED_SEED_SOLD
                || type === CROSS_COUNTRY_NUMBER_OF_ACTIVE_SEED_COMPANIES
                || type === CROSS_COUNTRY_NUMBER_VARIETIES_SOLD
                || type === CROSS_COUNTRY_MARKET_SHARE_TOP_FOUR_SEED_COMPANIES
                || type === CROSS_COUNTRY_MARKET_CONCENTRATION_HHI
                || type === CROSS_COUNTRY_MARKET_SHARE_STATE_OWNED_SEED_COMPANIES
                || type === CROSS_COUNTRY_VARIETY_RELEASE_PROCESS
                || type === CROSS_COUNTRY_OVERALL_RATING_NATIONAL_SEED_TRADE_ASSOCIATION
                || type === CROSS_COUNTRY_AGRODEALER_NETWORK
                || type === CROSS_COUNTRY_AVAILABILITY_SEED_SMALL_PACKAGES
                || type === CROSS_COUNTRY_AGRICULTURAL_EXTENSION_SERVICES) {
                setSelectedCrops([MAIZE]);
            }
            return null;
        }
        if (!initialCrops) {
            setSelectedCrops(crops);
            setInitialCrops(crops);
        } else {
            if (!isCrossCountryChart) {
                crops = selectedCrops;
            }
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

    /**
     * Given a crop index set it as selected (with crop name) and update the list of countries, if a country
     * has that crop then the country is active and selected, otherwise is disabled and unselected.
     * @param selected
     */
    const handleCrossCountryCropFilterChange = (selected) => {
        setSelectedCrops(crops[selected]);
        const ISOs = Object.keys(data.values);
        ISOs.forEach(i => {
            if (!isNaN(data.values[i][crops[selected]]) || data.values[i][crops[selected]] === 'MD') {
                countries.find(c => c.iso === i).active = true;
                countries.find(c => c.iso === i).selected = true;
            } else {
                countries.find(c => c.iso === i).active = false;
                countries.find(c => c.iso === i).selected = false;
            }
        });
        setCountries(countries);
    }

    const handleCrossCountryCountryFilterChange = (index, iso, isSelected) => {
        const aux = Object.assign(countries);
        aux.find(c => c.iso === iso).selected = isSelected;
        setCountries(aux);
        setForceUpdate(true);
    }

    const handleYearFilterChange = (selected) => {
        setSelectedYear(selected);
    }

    const processNumberVarietiesSold = () => {
        if (!noData) {
            const yearsInValues = Object.keys(data.values).sort();
            crops.forEach(c => {
                const header = {
                    id: c,
                    data: [],
                    color: getColor({ id: c.toLowerCase() })
                };
                yearsInValues.forEach(y => {
                    if (data.values[y]) {
                        header.data.push({
                            x: y,
                            y: data.values[y][c]
                        });
                        if (max < data.values[y][c]) {
                            max = data.values[y][c];
                        }
                    } else {
                        header.data.push({
                            x: y,
                            y: null
                        });
                    }
                });
                processedData.push(header);
            });
        }
    }

    const numberOfActiveBreeders = () => {
        if (years && crops) {
            years.forEach(y => {
                const yearObject = { year: y };
                let maxByYear = 0;
                crops.forEach(c => {
                    if (data.values[y][c] && !isNaN(data.values[y][c])) {
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
                    const item = { crop: c };
                    if (data.values[selectedYear][c]) {
                        keys.forEach(k => {
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

    const commonCrossCountryProcess = () => {
        if (crops && countries) {
            max = 0;
            let allFake = true;
            countries.filter(c => c.selected).forEach(c => {
                if (data.values[c.iso]) {
                    const item = {};
                    item.iso = c.iso;
                    item[c.iso] = !isNaN(data.values[c.iso][selectedCrops]) ? data.values[c.iso][selectedCrops] : FAKE_NUMBER;
                    
                    // Remove extra decimals by rounding to 2 decimals.
                    if (item[c.iso] !== FAKE_NUMBER) {
                        item[c.iso] = Math.round((item[c.iso] + Number.EPSILON) * 100) / 100;
                    }
                    
                    item.country = c.name;
                    item.year = data.values[c.iso].year;
                    processedData.push(item);
                    if (item[c.iso] !== FAKE_NUMBER && max < item[c.iso]) {
                        max = item[c.iso];
                        allFake = false;
                    }
                    item.textValue = "" + item[c.iso];
                    item.value = item[c.iso];
                }
            });
            /* SEEDSDT-1139: In horizontal charts it looks better to set some max so the vertical axis 
                doesn't land in the middle of the chart. */ 
            if (allFake) {
                max = 10;
            }
        }
    }

    const commonCrossCountryProcessSummarizeCrops = () => {
        const auxData = [];
        if (data && data.values && countries) {
            const selectedCountries = countries.filter(c => c.selected);
            max = 0;
            Object.keys(data.values).forEach(i => {
                if (selectedCountries.find(c => c.iso === i)) {
                    const item = {
                        iso: i,
                        country: COUNTRY_OPTIONS.find(j => j.flag.toLowerCase() === i.toLowerCase()).text
                    };
                    item.country = intl.formatMessage({id: normalizeField(item.country)});
                    let sum = 0;
                    Object.keys(data.values[i]).forEach(j => {
                        if (j !== 'year') {
                            sum += data.values[i][j];
                        }
                    });
                    item.textValue = "" + sum;
                    item.value = sum;
                    item.year = data.values[i].year;
                    if (max < sum) {
                        max = sum;
                    }
                    auxData.push(item);
                }
            });
        }
        processedData = auxData;
    }

    const commonCrossCountryProcessWithoutCrops = () => {
        const auxData = [];
        if (data && data.values && countries) {
            const selectedCountries = countries.filter(c => c.selected);
            max = 0;
            Object.keys(data.values).forEach(i => {
                if (selectedCountries.find(c => c.iso === i)) {
                    const item = {
                        iso: i,
                        country: COUNTRY_OPTIONS.find(j => j.flag.toLowerCase() === i.toLowerCase()).text
                    };
                    item.country = intl.formatMessage({id: normalizeField(item.country)});
                    item.year = data.values[i].year;
                    if (!isNaN(data.values[i].value)) {
                        item.textValue = "" + data.values[i].value;
                        item.value = data.values[i].value;
                        if (max < item.value) {
                            max = item.value;
                        }
                    } else {
                        item.textValue = FAKE_NUMBER;
                        item.value = FAKE_NUMBER
                    }
                    auxData.push(item);
                }
            });
        }
        processedData = auxData;
    }

    const commonProcess = (c, entry, yearColors) => {
        const newBarColors = yearColors ? [...yearColors] : null;
        Object.keys(data.values[c]).forEach((i, j) => {
            if (selectedYear && selectedYear.find(k => k === i)) {
                const key = '' + i;
                entry[key] = Number(data.values[c][i]) >= 0 ? data.values[c][i] : FAKE_NUMBER;

                // Change % to 100 scale.
                if (type === MARKET_SHARE_TOP_FOUR_SEED_COMPANIES || type === MARKET_SHARE_STATE_OWNED_SEED_COMPANIES) {
                    if (entry[key] !== FAKE_NUMBER) {
                        entry[key] = Math.round(entry[key] * 100);
                    }
                }

                if (!keys.find(i => i === key)) {
                    keys.push(key);
                }
                if (yearColors && newBarColors) {
                    if (!colors.get(key)) {
                        colors.set(key, newBarColors.shift());
                    }
                }
                if (Number(entry[i]) > max) {
                    max = Number(entry[i]);
                }
            }
        });
        processedData.push(entry);
    }

    const commonProcessCrossCountry = (c, entry, countryColors, useOnlyLastYear) => {
        const newBarColors = countryColors ? [...countryColors] : null;
        Object.keys(data.values[c]).forEach((i, j) => {
            if (countries && countries.find(k => k.iso === i && k.selected === true)) {
                let key = COUNTRY_OPTIONS.find(j => j.flag.toLowerCase() === i.toLowerCase()).text;
                if (useOnlyLastYear) {
                    key = intl.formatMessage({id: normalizeField(key)});
                    const years = Object.keys(data.values[c][i]).sort();
                    const lastYear = years[years.length - 1];
                    key += ' - ' + lastYear;
                    entry[key] = Number(data.values[c][i][lastYear]) >= 0 ? data.values[c][i][lastYear] : FAKE_NUMBER;
                } else {
                    entry[key] = Number(data.values[c][i]) >= 0 ? data.values[c][i] : FAKE_NUMBER;
                }
                if (!keys.find(i => i === key)) {
                    keys.push(key);
                }
                if (countryColors && newBarColors) {
                    if (!colors.get(key)) {
                        colors.set(key, newBarColors.shift());
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
        processedData = [];
        let auxData = [];
        max = 0;
        const selectedCountries = countries.filter(c => c.selected);
        Object.keys(data.values).forEach(i => {
            if (selectedCountries.find(c => c.iso === i)) {
                const entry = {
                    country: COUNTRY_OPTIONS.find(j => j.flag.toLowerCase() === i.toLowerCase()).text,
                    publicSeedInspectors: data.values[i].public || 0,
                    privateSeedInspectors: data.values[i].private || 0,
                    year: data.values[i].year,
                    total: data.values[i].total,
                }
                entry.country = intl.formatMessage({id: normalizeField(entry.country)});
                auxData.push(entry);
                noData = false;

                if (entry.privateSeedInspectors + entry.publicSeedInspectors > max) {
                    max = entry.privateSeedInspectors + entry.publicSeedInspectors;
                }
            }
        });
        max = max * 0.95;
        auxData.sort((a, b) => b.country.localeCompare(a.country));
        auxData.forEach(i => {
            processedData.push(i);
        });
        colors.set('privateSeedInspectors', crossCountryBarColor[1]);
        colors.set('publicSeedInspectors', crossCountryBarColor[0]);
    }

    const processByYear = () => {
        crops.forEach(c => {
            const entry = { crop: c };
            commonProcess(c, entry);
            keys.sort();
        });
        // Fix missing data from the EP (crop without one or more years data).
        const newBarColors = [...barColors];
        processedData.forEach(p => {
            years.forEach(y => {
                if (isNaN(Number(p[y]))) {
                    processedData.find(i => i.crop === p.crop)[y] = FAKE_NUMBER;
                    // data.values[p.crop][y] = 'MD';
                } else {
                    if (roundNumbers && p[y] !== FAKE_NUMBER) {
                        // Notice we check for p[y] !== FAKE_NUMBER or 0.001 will be converted in 0 thus hiding the MD total.
                        p[y] = Math.round(p[y]);
                    }
                }
                // Process color here to prevent SEEDSDT-583
                if (!colors.get(y)) {
                    colors.set(y, newBarColors.shift());
                }
            });
        });
    }

    const processForRadar = (dimensionValues) => {
        dimensionValues.forEach(d => {
            const entry = {};
            entry[indexBy] = intl.formatMessage({
                id: d,
                defaultMessage: d
            });
            commonProcess(d, entry, performanceColors);
        });
    }

    const processForRadarCrossCountry = (dimensionValues, useOnlyLastYear) => {
        dimensionValues.forEach(d => {
            const entry = {};
            entry[indexBy] = intl.formatMessage({
                id: d,
                defaultMessage: d
            });
            commonProcessCrossCountry(d, entry, performanceColors, useOnlyLastYear);
            noData = false;
        });
    }

    const processVarietiesReleasedWithSpecialFeatures = () => {
        if (crops) {
            crops.forEach(c => {
                let sumWF = 0;
                let sumWOF = 0;
                if (selectedYear && selectedYear.length > 0) {
                    //selected year is expected to be 1
                    sumWF = data.values[c] && data.values[c][selectedYear] && data.values[c][selectedYear].withspecialfeature || 0;
                    sumWOF = data.values[c] && data.values[c][selectedYear] && data.values[c][selectedYear].withoutspecialfeature || 0;
                } else {
                    Object.keys(data.values[c]).forEach(i => {
                        sumWF += data.values[c][i].withspecialfeature || 0;
                        sumWOF += data.values[c][i].withoutspecialfeature || 0;
                    });
                }

                sumWF = sumWF === 'MD' ? FAKE_NUMBER : sumWF;
                sumWOF = sumWOF === 'MD' ? FAKE_NUMBER : sumWOF;

                const key1 = 'withSpecialFeature_' + c;
                const key2 = 'withoutSpecialFeature_' + c;
                const header = {
                    crop: intl.formatMessage({ id: c, defaultMessage: c }),
                    originalCrop: c,
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
        noData = max === FAKE_NUMBER;
    }

    let subLabel = '';
    let roundNumbers = false;
    switch (type) {
        case NUMBER_VARIETIES_SOLD:
        case PRICE_SEED_PLANTING:
        case QUANTITY_CERTIFIED_SEED_SOLD:
        case AVERAGE_AGE_VARIETIES_SOLD:
        case MARKET_SHARE_TOP_FOUR_SEED_COMPANIES:
        case MARKET_SHARE_STATE_OWNED_SEED_COMPANIES:
        case NUMBER_OF_ACTIVE_SEED_COMPANIES_PRODUCERS: {
            customTickWithCropsBottom = true;
            leftLegend = intl.formatMessage({ id: 'number-of-years', defaultMessage: 'Number of Years' });
            bottomLegend = intl.formatMessage({ id: 'crops-years', defaultMessage: 'Crop > Year' });
            if (type === NUMBER_VARIETIES_SOLD) {
                getTooltipText = (d) => {
                    return <>
                        <span>{intl.formatMessage({
                            id: 'tooltip-number-of-varieties-sold',
                            defaultMessage: 'Number of varieties sold'
                        })}</span>
                        <span className="bold"> {d.data[d.id]}  </span><br />
                        <span>{intl.formatMessage({ id: 'tooltip-year', defaultMessage: 'Year' })}</span>
                        <span className="bold"> {d.id}  </span>
                    </>
                }
                getTooltipHeader = (d) => {
                    return <>
                        <div className={d.indexValue.toLowerCase() + " crop-icon"} />
                        <div className="crop-name">{intl.formatMessage({
                            id: d.indexValue,
                            defaultMessage: d.indexValue
                        })}</div>
                    </>;
                }
                leftLegend = intl.formatMessage({
                    id: 'number-of-varieties-sold',
                    defaultMessage: 'Number of varieties sold'
                });
                lineTooltip = (d) => {
                    return (<div className="tooltip-container-line">
                        <div className="header-container">
                            <div className="header">
                                <div className="inner-container">
                                    <div className={d.point.serieId.toLowerCase() + " crop-icon"} />
                                    <div className="crop-name">{intl.formatMessage({
                                        id: d.point.serieId,
                                        defaultMessage: d.point.serieId
                                    })}</div>
                                </div>
                            </div>
                        </div>
                        <div className="amount-container">
                            <span className="normal">{intl.formatMessage({
                                id: 'tooltip-number-of-varieties-sold',
                                defaultMessage: 'Number of varieties sold'
                            })}</span>
                            <span
                                className="bold"> {d.point.data.y !== FAKE_NUMBER ? d.point.data.y : 'MD'}  </span><br />
                            <span className="normal">{intl.formatMessage({
                                id: 'tooltip-year',
                                defaultMessage: 'Year'
                            })}</span>
                            <span className="bold"> {d.point.data.x}  </span>
                        </div>
                    </div>)
                }
            } else if (type === AVERAGE_AGE_VARIETIES_SOLD) {
                roundNumbers = true;
                leftLegend = intl.formatMessage({ id: 'average-age', defaultMessage: 'Average age (years)' });
                bottomLegend = intl.formatMessage({ id: 'crops-years', defaultMessage: 'Crop > Year' });
                getTooltipText = (d) => {
                    return <>
                        <span>{intl.formatMessage({
                            id: 'tooltip-average-age',
                            defaultMessage: 'Average Age'
                        })}</span><span
                        className="bold"> {d.data[d.id]}  </span><br />
                        <span>{intl.formatMessage({ id: 'tooltip-year', defaultMessage: 'Year' })}</span><span
                        className="bold"> {d.id}  </span>

                    </>
                }
                getTooltipHeader = (d) => {
                    return <>
                        <div className={d.indexValue.toLowerCase() + " crop-icon"} />
                        <div className="crop-name">{intl.formatMessage({
                            id: d.indexValue,
                            defaultMessage: d.indexValue
                        })}</div>
                    </>;
                }
                lineTooltip = (d) => {
                    return (<div className="tooltip-container-line">
                        <div className="header-container">
                            <div className="header">
                                <div className="inner-container">
                                    <div className={d.point.serieId.toLowerCase() + " crop-icon"} />
                                    <div className="crop-name">{intl.formatMessage({
                                        id: d.point.serieId,
                                        defaultMessage: d.point.serieId
                                    })}</div>
                                </div>
                            </div>
                        </div>
                        <div className="amount-container">
              <span className="normal">{intl.formatMessage({
                  id: 'tooltip-average-age',
                  defaultMessage: 'Average Age'
              })}</span>
                            <span
                                className="bold"> {d.point.data.y !== FAKE_NUMBER ? d.point.data.y : 'MD'}  </span><br />
                            <span className="normal">{intl.formatMessage({
                                id: 'tooltip-year',
                                defaultMessage: 'Year'
                            })}</span>
                            <span className="bold"> {d.point.data.x}  </span>
                        </div>
                    </div>)
                }
            } else if (type === PRICE_SEED_PLANTING) {
                leftLegend = intl.formatMessage({
                    id: 'price-usd-by-kg',
                    defaultMessage: 'Average price (USD/kg)'
                });
                getTooltipText = (d) => {
                    return <>
                        <span>{intl.formatMessage({
                            id: 'tooltip-price-usd-by-kg',
                        })}</span> <span className="bold">{d.data[d.id]}</span> <span className="normal">USD</span>
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
                lineTooltip = (d) => {
                    return (<div className="tooltip-container-line">
                        <div className="header-container">
                            <div className="header">
                                <div className="inner-container">
                                    <div className={d.point.serieId.toLowerCase() + " crop-icon"} />
                                    <div className="crop-name">{intl.formatMessage({
                                        id: d.point.serieId,
                                        defaultMessage: d.point.serieId
                                    })}</div>
                                </div>
                            </div>
                        </div>
                        <div className="amount-container">
                            <span className="normal">{intl.formatMessage({
                                id: 'tooltip-price-usd-by-kg'
                            })}</span> {d.point.data.y !== FAKE_NUMBER
                            ? (<><span className="bold">{d.point.data.y} </span><span className="normal">USD</span></>)
                            : 'MD'}
                        </div>
                    </div>)
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
                        <div className="crop-name">{intl.formatMessage({
                            id: d.indexValue,
                            defaultMessage: d.indexValue
                        })}</div>
                    </>;
                }
                lineTooltip = (d) => {
                    return (<div className="tooltip-container-line">
                        <div className="header-container">
                            <div className="header">
                                <div className="inner-container">
                                    <div className={d.point.serieId.toLowerCase() + " crop-icon"} />
                                    <div className="crop-name">{intl.formatMessage({
                                        id: d.point.serieId,
                                        defaultMessage: d.point.serieId
                                    })}</div>
                                </div>
                            </div>
                        </div>
                        <div className="amount-container" style={{ width: '200px', textAlign: "left" }}>
              <span className="normal" style={{ wordWrap: "break-word", maxWidth: '190px' }}>{intl.formatMessage({
                  id: 'tooltip-market-share-top-companies',
                  defaultMessage: 'Market share of top four companies'
              })}</span>
                            <span
                                className="bold"> {d.point.data.y !== FAKE_NUMBER ? d.point.data.y + '%' : 'MD'}</span>
                        </div>
                    </div>)
                }
            } else if (type === MARKET_SHARE_STATE_OWNED_SEED_COMPANIES) {
                dataSuffix = '%';
                leftLegend = intl.formatMessage({
                    id: 'market-share-state-owned',
                    defaultMessage: 'Market share (out of 100%)'
                });
                getTooltipText = (d) => {
                    return (<>
                        <span>{intl.formatMessage({
                            id: 'tooltip-market-share-state-owned',
                            defaultMessage: 'Market share of state owned companies'
                        })}</span>
                        <span className="bold"> {d.data[d.id]}%</span><br />
                    </>);
                }
                getTooltipHeader = (d) => {
                    return <>
                        <div className={d.indexValue.toLowerCase() + " crop-icon"} />
                        <div className="crop-name">{intl.formatMessage({
                            id: d.indexValue,
                            defaultMessage: d.indexValue
                        })}</div>
                    </>;
                }
                lineTooltip = (d) => {
                    return (<div className="tooltip-container-line">
                        <div className="header-container">
                            <div className="header">
                                <div className="inner-container">
                                    <div className={d.point.serieId.toLowerCase() + " crop-icon"} />
                                    <div className="crop-name">{intl.formatMessage({
                                        id: d.point.serieId,
                                        defaultMessage: d.point.serieId
                                    })}</div>
                                </div>
                            </div>
                        </div>
                        <div className="amount-container" style={{ width: '200px', textAlign: "left" }}>
              <span className="normal">{intl.formatMessage({
                  id: 'tooltip-market-share-state-owned',
                  defaultMessage: 'Market share of state owned companies'
              })}</span>
                            <span
                                className="bold"> {d.point.data.y !== FAKE_NUMBER ? d.point.data.y + '%' : 'MD'}</span><br />
                        </div>
                    </div>)
                }
                if (max === 0) {
                    max = 100;
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
                        <span className="bold"> {intl.formatNumber(d.data[d.id])}</span><span> {intl.formatMessage({
                        id: 'metric-tons',
                        defaultMessage: 'Metric tons'
                    }).toLowerCase()}</span>
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
                lineTooltip = (d) => {
                    return (<div className="tooltip-container-line">
                        <div className="header-container">
                            <div className="header">
                                <div className="inner-container">
                                    <div className={d.point.serieId.toLowerCase() + " crop-icon"} />
                                    <div className="crop-name">{intl.formatMessage({
                                        id: d.point.serieId,
                                        defaultMessage: d.point.serieId
                                    })}</div>
                                </div>
                            </div>
                        </div>
                        <div className="amount-container" style={{ width: '200px', textAlign: "left" }}>
              <span className="normal">{intl.formatMessage({
                  id: 'tooltip-quantity-certified-seed-sold',
                  defaultMessage: 'Quantity of certified seed sold'
              })}</span>
                            <span className="bold"> {d.point.data.y !== FAKE_NUMBER ? d.point.data.y : 'MD'}</span>
                            <span className="normal"> metric tons</span>
                        </div>
                    </div>)
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
                        <span>{intl.formatMessage({
                            id: "seeds-companies-producers",
                            defaultMessage: "seed companies / producers"
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
                lineTooltip = (d) => {
                    return (<div className="tooltip-container-line">
                        <div className="header-container">
                            <div className="header">
                                <div className="inner-container">
                                    <div className={d.point.serieId.toLowerCase() + " crop-icon"} />
                                    <div className="crop-name">{intl.formatMessage({
                                        id: d.point.serieId,
                                        defaultMessage: d.point.serieId
                                    })}</div>
                                </div>
                            </div>
                        </div>
                        <div className="amount-container">
                            <span className="bold"> {d.point.data.y !== FAKE_NUMBER ? d.point.data.y : 'MD'} </span>
                            <span className="normal">seed companies / producers </span>
                        </div>
                    </div>)
                }
            }
            legend = 'Year';
            groupMode = 'grouped';
            withCropsWithSpecialFeatures = false;
            processByYear();

            // Reprocess data and change to line chart.
            // TODO: move this code to a common function like processByYear().
            if (type === PRICE_SEED_PLANTING
                || type === NUMBER_OF_ACTIVE_SEED_COMPANIES_PRODUCERS
                || type === MARKET_SHARE_TOP_FOUR_SEED_COMPANIES
                || type === NUMBER_VARIETIES_SOLD
                || type === MARKET_SHARE_STATE_OWNED_SEED_COMPANIES
                || type === AVERAGE_AGE_VARIETIES_SOLD
                || type === QUANTITY_CERTIFIED_SEED_SOLD) {
                if (years.length > 3) {
                    switchToLineChart = true;
                    const newProcessedData = [];
                    processedData.forEach((i, index) => {
                        const item = { id: i.crop, color: getColor({ id: i.crop }), data: [] };
                        Object.keys(processedData[index]).filter(k => k !== indexBy).forEach(j => {
                            if (processedData[index][j] !== FAKE_NUMBER) {
                                item.data.push({
                                    x: j,
                                    y: processedData[index][j]
                                });
                            } else {
                                item.data.push({
                                    x: j,
                                    y: null
                                });
                            }
                        });
                        newProcessedData.push(item);
                    });
                    processedData = newProcessedData;
                    bottomLegend = intl.formatMessage({ id: 'year-legend', defaultMessage: 'Year' });
                    legend = 'crops';
                    addLighterDiv = false;
                    useFilterByYear = false;
                } else if (years.length === 1) {
                    // TODO: make this part common for other charts.
                    legend = 'crops';
                    addLighterDiv = false;
                    getColors = (item) => {
                        return baseColors[item.indexValue];
                    }
                }
            }
            break;
        }
        case VARIETIES_RELEASED_WITH_SPECIAL_FEATURES:
            getTooltipText = (d) => {
                const varietiesReleased = intl.formatMessage({
                    id: "tooltip-varieties-released",
                    defaultMessage: "varieties released"
                });
                const with_ = intl.formatMessage({
                    id: "with",
                    defaultMessage: "with"
                });
                const withOut_ = intl.formatMessage({
                    id: "with-out"
                });
                const specialFeatures = intl.formatMessage({
                    id: "special-features"
                });
                return <>
          <span
              className="bold"> {d.data[d.id]} {intl.formatMessage({id: 'out-of'})} {(d.data['withSpecialFeature_' + d.indexValue.toLowerCase()] || 0)
              + (d.data['withoutSpecialFeature_' + d.indexValue.toLowerCase()] || 0)} </span>
                    <span>{varietiesReleased} {d.id.startsWith('withSpecial')
                        ? (<>{with_} <span className="bold">{specialFeatures}</span></>)
                        : <>{withOut_} <span className="bold">{specialFeatures}</span></>}</span>
                </>
            }
            getTooltipHeader = (d) => {
                return <>
                    <div
                        className={d.data.originalCrop + " crop-icon"} />
                    <div className="crop-name">{intl.formatMessage({
                        id: d.indexValue,
                        defaultMessage: d.indexValue
                    })} {selectedYear}</div>
                </>
            }
            leftLegend = intl.formatMessage({
                id: 'number-of-varieties-released',
                defaultMessage: 'Number of Varieties Released'
            });
            bottomLegend = intl.formatMessage({ id: 'crop-legend', defaultMessage: 'Crop' });
            processVarietiesReleasedWithSpecialFeatures();
            showTotalMD = false;
            break;
        case CROSS_COUNTRY_NUMBER_OF_ACTIVE_BREEDERS:
        case CROSS_COUNTRY_NUMBER_OF_VARIETIES_RELEASED:
        case CROSS_COUNTRY_QUANTITY_CERTIFIED_SEED_SOLD:
        case CROSS_COUNTRY_NUMBER_OF_ACTIVE_SEED_COMPANIES:
        case CROSS_COUNTRY_NUMBER_VARIETIES_SOLD:
        case CROSS_COUNTRY_MARKET_SHARE_TOP_FOUR_SEED_COMPANIES:
        case CROSS_COUNTRY_MARKET_CONCENTRATION_HHI:
        case CROSS_COUNTRY_MARKET_SHARE_STATE_OWNED_SEED_COMPANIES:
        case CROSS_COUNTRY_VARIETY_RELEASE_PROCESS:
        case CROSS_COUNTRY_OVERALL_RATING_NATIONAL_SEED_TRADE_ASSOCIATION:
        case CROSS_COUNTRY_AGRODEALER_NETWORK:
        case CROSS_COUNTRY_AVAILABILITY_SEED_SMALL_PACKAGES:
        case CROSS_COUNTRY_AGRICULTURAL_EXTENSION_SERVICES:
        case CROSS_COUNTRY_NUMBER_SEED_INSPECTORS:
            // Common code section.
            commonCrossCountryProcess();
            useFilterByCropsWithCountries = true;
            useCropLegendsRow = false;
            useFilterByCrops = false;
            leftLegend = intl.formatMessage({
                id: 'label-country',
                defaultMessage: 'Country'
            });
            indexBy = 'country';
            keys.push('textValue');
            legends = [];
            layout = 'horizontal';
            enableGridX = true;
            enableGridY = false;
            getColors = (item) => {
                return baseColors[selectedCrops];
            }
            // containerHeight = 525; 
            const windowHeight = window.innerHeight;
            containerHeight = (windowHeight - 200);
            animate = true;
            totalLabel.show = true;
            groupMode = 'grouped';
            margins = { top: 20, right: 60, bottom: 55, left: 90 }

            // This is the most common header.
            getTooltipHeader = (d) => {
                return <>
                    <div className={selectedCrops + " crop-icon"} />
                    <div className="crop-name">{intl.formatMessage({
                        id: selectedCrops, defaultMessage: selectedCrops
                    })} - {d.indexValue} - {d.data.year}</div>
                </>;
            }

            // Section for each cross-country chart.
            switch (type) {
                case CROSS_COUNTRY_NUMBER_SEED_INSPECTORS:
                    getTooltipHeader = (d) => {
                        return <div className="country-header">{`${d.data.country} ${d.data.year}`}</div>
                    }
                    getTooltipText = (d) => {
                        return (<>
                    <span>{intl.formatMessage({
                        id: 'tooltip-public-inspectors-legend',
                        defaultMessage: 'Public seed inspectors'
                    })} </span>
                            <span className="bold"
                                  style={{ color: crossCountryBarColor[0] }}> {d.data.publicSeedInspectors || 0}</span>
                            <br />
                            <span>{intl.formatMessage({
                                id: 'tooltip-private-inspectors-legend',
                                defaultMessage: 'Private seed inspectors'
                            })} </span>
                            <span className="bold"
                                  style={{ color: crossCountryBarColor[1] }}> {d.data.privateSeedInspectors || 0}</span>
                            <br />
                            <span>{intl.formatMessage({
                                id: 'tooltip-total-inspectors-legend',
                                defaultMessage: 'Total seed inspectors'
                            })} </span>
                            <span className="bold"> {d.data.total || 0}</span>
                        </>);
                    }
                    bottomLegend = intl.formatMessage({
                        id: 'number-seed-inspectors-legend',
                        defaultMessage: 'Number of seed inspectors'
                    });
                    useFilterByCropsWithCountries = false;
                    useFilterByYear = false;
                    useFilterByCrops = false;
                    keys.splice(0);
                    keys.push('publicSeedInspectors', 'privateSeedInspectors');
                    leftLegend = intl.formatMessage({ id: 'countries', defaultMessage: 'Countries' });
                    groupMode = 'stacked';
                    getColors = undefined;
                    addLighterDiv = false;
                    withCropsWithSpecialFeatures = false;
                    useCropLegendsRow = true;
                    legend = genericLegend;
                    legendTitle = '';
                    useFilterByCountries = true;
                    customCrossCountryLegend = () => {
                        const cropsLegendTranslated = intl.formatMessage({
                            id: 'crops-legend',
                            defaultMessage: 'Crops'
                        });
                        return (<Grid.Row className={`crops-with-icons`}>
                            <Grid.Column width={16}>
                                <div style={{
                                    width: 'max-content',
                                    float: "left",
                                    marginTop: '10px'
                                }}>{legend === 'crops' &&
                                    <CropsLegend data={selectedCrops} title={cropsLegendTranslated}
                                                 titleClass="crops-title"
                                                 addLighterDiv={addLighterDiv}
                                                 intl={intl} />}
                                    {legend && legend.toLowerCase() === 'year' &&
                                        <YearLegend colors={yearsColors} years={selectedYear} intl={intl} />}
                                    {legend && legend === genericLegend &&
                                        <GenericLegend colors={colors} keys={keys} title={legendTitle} />}
                                </div>
                                <div style={{
                                    width: 'max-content',
                                    float: "left",
                                    fontSize: '16px',
                                    color: '#333c48',
                                    marginTop: '12px'
                                }}>
                                    |&nbsp;&nbsp;&nbsp;
                                    <bold>{intl.formatMessage({id: 'md'})}:</bold>
                                    <span style={{ fontWeight: "normal" }}> {intl.formatMessage({
                                        id: "indicator-data-missing",
                                        defaultMessage: "Indicator data missing"
                                    })} </span>
                                    <bold>{intl.formatMessage({id: 'na'})}:</bold>
                                    <span style={{ fontWeight: "normal" }}> {intl.formatMessage({
                                        id: "indicator-not-applicable",
                                        defaultMessage: "Indicator not applicable"
                                    })}</span>
                                </div>
                            </Grid.Column>
                        </Grid.Row>);
                    };
                    processInspectorsByCountry();
                    break;
                case CROSS_COUNTRY_NUMBER_OF_ACTIVE_BREEDERS:
                    bottomLegend = intl.formatMessage({
                        id: 'active-breeders-legend',
                        defaultMessage: 'Active breeders per 1,000,000 hectares'
                    });
                    getTooltipText = (d) => {
                        return <>
                            <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'active-breeders-tooltip',
                            defaultMessage: 'Number of active breeders'
                        })}: </span>
                                <span
                                    className="bold"> {d.value !== FAKE_NUMBER ? d.value + '/1,000,000 ha' : 'MD'}</span>
                            </div>
                        </>
                    }
                    totalLabel.format = false;
                    break;
                case CROSS_COUNTRY_NUMBER_OF_VARIETIES_RELEASED:
                    bottomLegend = intl.formatMessage({
                        id: 'varieties-released-legend',
                        defaultMessage: 'Varieties released per 1,000,000 hectares'
                    });
                    getTooltipText = (d) => {
                        return <>
                            <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'varieties-released-tooltip',
                            defaultMessage: 'Number of varieties released per land under production'
                        })}: </span>
                                <span
                                    className="bold"> {d.value !== FAKE_NUMBER ? d.value + '/1,000,000 ha' : 'MD'}</span>
                            </div>
                        </>
                    }
                    totalLabel.format = false;
                    break;
                case CROSS_COUNTRY_QUANTITY_CERTIFIED_SEED_SOLD:
                    bottomLegend = intl.formatMessage({
                        id: 'quantity-certified-seed-sold-legend',
                        defaultMessage: 'Metric tons/ per 1,000 hectares'
                    });
                    getTooltipText = (d) => {
                        return <>
                            <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'quantity-certified-seed-sold-tooltip',
                            defaultMessage: 'Certified seed sold'
                        })}: </span>
                                <span
                                    className="bold"> {d.value !== FAKE_NUMBER ? d.value + 't / 1,000 ha' : 'MD'}</span>
                            </div>
                        </>
                    }
                    totalLabel.format = false;
                    break;
                case CROSS_COUNTRY_NUMBER_OF_ACTIVE_SEED_COMPANIES:
                    bottomLegend = intl.formatMessage({
                        id: 'active-seed-companies-legend',
                        defaultMessage: 'Active seed companies'
                    });
                    getTooltipText = (d) => {
                        return <>
                            <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'active-seed-companies-tooltip',
                            defaultMessage: 'Number of active seed companies'
                        })}: </span>
                                <span className="bold"> {d.value !== FAKE_NUMBER ? d.value : 'MD'}</span>
                            </div>
                        </>
                    }
                    getTooltipHeader = (d) => {
                        return <>
                            <div className="without-crop-name">{d.indexValue} - {d.data.year}</div>
                        </>;
                    }
                    commonCrossCountryProcessWithoutCrops();
                    useFilterByCropsWithCountries = false;
                    useFilterByCountries = true;
                    customSorting = (a, b) => (b.country.localeCompare(a.country));
                    break;
                case CROSS_COUNTRY_NUMBER_VARIETIES_SOLD:
                    bottomLegend = intl.formatMessage({
                        id: 'number-varieties-sold-legend',
                        defaultMessage: 'Varieties sold'
                    });
                    getTooltipText = (d) => {
                        return <>
                            <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'number-varieties-sold-tooltip',
                            defaultMessage: 'Number of varieties sold'
                        })}: </span>
                                <span className="bold"> {d.value !== FAKE_NUMBER ? d.value : 'MD'}</span>
                            </div>
                        </>
                    }
                    break;
                case CROSS_COUNTRY_MARKET_SHARE_TOP_FOUR_SEED_COMPANIES:
                    // Fix %.
                    processedData.forEach(i => {
                        if (i.value !== FAKE_NUMBER) {
                            // Cleanup the number just in case its reported in the wrong range (0 to 100). 
                            if (i.value > 1) {
                                i.value = i.value / 100;
                            }
                            i.value = intl.formatNumber(i.value * 100);
                            i.textValue = "" + i.value;
                        } else {
                            i.value = "MD";
                            i.textValue = FAKE_NUMBER;
                        }
                    });
                    max = 100;

                    dataSuffix = "%";
                    bottomLegend = intl.formatMessage({
                        id: 'market-share-top4-legend',
                        defaultMessage: 'Market share (%)'
                    });
                    getTooltipText = (d) => {
                        return <>
                            <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'market-share-top4-tooltip',
                            defaultMessage: 'Market share of top four companies'
                        })}: </span>
                                <span className="bold"> {d.value !== FAKE_NUMBER ? d.value + '%' : 'MD'}</span>
                            </div>
                        </>
                    }
                    break;
                case CROSS_COUNTRY_MARKET_CONCENTRATION_HHI:
                    bottomLegend = intl.formatMessage({
                        id: 'hhi-legend',
                        defaultMessage: 'HHI Score'
                    });
                    getTooltipText = (d) => {
                        return <>
                            <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'hhi-tooltip',
                            defaultMessage: 'HHI value'
                        })}: </span>
                                <span className="bold"> {d.value !== FAKE_NUMBER ? intl.formatNumber(d.value) : 'MD'}</span>
                            </div>
                        </>
                    }
                    getColors = (item) => {
                        return getColorHHI(item.value);
                    }
                    useHHILegends = true;
                    totalLabel.format = { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 };
                    containerHeight -= 50;
                    break;
                case CROSS_COUNTRY_MARKET_SHARE_STATE_OWNED_SEED_COMPANIES:
                    // Fix %.
                    processedData.forEach(i => {
                        if (i.value !== FAKE_NUMBER) {
                            // Cleanup the number just in case its reported in the wrong range (0 to 100). 
                            if (i.value > 1) {
                                i.value = i.value / 100;
                            }
                            i.value = intl.formatNumber(i.value * 100);
                            i.textValue = "" + i.value;
                        } else {
                            i.value = "MD";
                            i.textValue = FAKE_NUMBER;
                        }
                    });
                    max = 100;

                    dataSuffix = "%";
                    bottomLegend = intl.formatMessage({
                        id: 'market-share-state-owned-legend',
                        defaultMessage: 'Market share (%)'
                    });
                    getTooltipText = (d) => {
                        return <>
                            <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'market-share-top4-tooltip',
                            defaultMessage: 'Market share of top four companies'
                        })}: </span>
                                <span className="bold"> {d.value !== FAKE_NUMBER ? d.value + '%' : 'MD'}</span>
                            </div>
                        </>
                    }
                    break;
                case CROSS_COUNTRY_VARIETY_RELEASE_PROCESS:
                    bottomLegend = intl.formatMessage({
                        id: 'variety-release-process-legend',
                        defaultMessage: 'Number of months'
                    });
                    getTooltipText = (d) => {
                        return <>
                            <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'variety-release-process-tooltip',
                            defaultMessage: 'Number of months'
                        })}: </span>
                                <span className="bold"> {d.value !== FAKE_NUMBER ? d.value : 'MD'}</span>
                            </div>
                        </>
                    }
                    getTooltipHeader = (d) => {
                        return <>
                            <div className="without-crop-name">{d.indexValue} - {d.data.year}</div>
                        </>;
                    }
                    commonCrossCountryProcessWithoutCrops();
                    useFilterByCropsWithCountries = false;
                    useFilterByCountries = true;
                    customSorting = (a, b) => (b.country.localeCompare(a.country));
                    break;
                case CROSS_COUNTRY_OVERALL_RATING_NATIONAL_SEED_TRADE_ASSOCIATION:
                    bottomLegend = intl.formatMessage({
                        id: 'overall-rating-seed-association-legend',
                        defaultMessage: 'Member opinion (out of 100%)'
                    });
                    getTooltipText = (d) => {
                        return <>
                            <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'overall-rating-seed-association-tooltip',
                            defaultMessage: 'Opinion rating'
                        })}: </span>
                                <span className="bold"> {d.value !== FAKE_NUMBER ? d.value + '%' : 'MD'}</span>
                            </div>
                        </>
                    }
                    getTooltipHeader = (d) => {
                        return <>
                            <div className="without-crop-name">{d.indexValue} - {d.data.year}</div>
                        </>;
                    }
                    commonCrossCountryProcessWithoutCrops();
                    useFilterByCropsWithCountries = false;
                    useFilterByCountries = true;
                    customSorting = (a, b) => (b.country.localeCompare(a.country));
                    dataSuffix = "%";
                    max = max < 95 ? 95 : max;
                    break;
                case CROSS_COUNTRY_AGRODEALER_NETWORK:
                    bottomLegend = intl.formatMessage({
                        id: 'agrodealer-network-legend',
                        defaultMessage: 'Agrodealers / households'
                    });
                    getTooltipText = (d) => {
                        return <>
                            <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'agrodealer-network-tooltip',
                            defaultMessage: 'Households per agrodealers'
                        })}: </span>
                                <span className="bold"> {d.value !== FAKE_NUMBER ? intl.formatNumber(d.value) : 'MD'}</span>
                            </div>
                        </>
                    }
                    getTooltipHeader = (d) => {
                        return <>
                            <div className="without-crop-name">{d.indexValue} - {d.data.year}</div>
                        </>;
                    }
                    commonCrossCountryProcessWithoutCrops();
                    useFilterByCropsWithCountries = false;
                    useFilterByCountries = true;
                    customSorting = (a, b) => (b.country.localeCompare(a.country));
                    totalLabel.format = { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 };
                    break;
                case CROSS_COUNTRY_AGRICULTURAL_EXTENSION_SERVICES:
                    bottomLegend = intl.formatMessage({
                        id: 'extension-office-household-legend'
                    });
                    getTooltipText = (d) => {
                        return <>
                            <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'extension-office-household-tooltip',
                            defaultMessage: 'Households per extension officer'
                        })}: </span>
                                <span className="bold"> {d.value !== FAKE_NUMBER ? intl.formatNumber(d.value) : 'MD'}</span>
                            </div>
                        </>
                    }
                    getTooltipHeader = (d) => {
                        return <>
                            <div className="without-crop-name">{d.indexValue} - {d.data.year}</div>
                        </>;
                    }
                    commonCrossCountryProcessWithoutCrops();
                    useFilterByCropsWithCountries = false;
                    useFilterByCountries = true;
                    customSorting = (a, b) => (b.country.localeCompare(a.country));
                    break;
                case CROSS_COUNTRY_AVAILABILITY_SEED_SMALL_PACKAGES:
                    bottomLegend = intl.formatMessage({
                        id: 'availability-seed-small-packages-legend',
                        defaultMessage: 'Percentage of seeds in 2kg package'
                    });
                    getTooltipText = (d) => {
                        return <>
                            <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'availability-seed-small-packages-tooltip',
                            defaultMessage: 'Seeds sold in 2kg package'
                        })}: </span>
                                <span className="bold"> {d.value !== FAKE_NUMBER ? d.value + '%' : 'MD'}</span>
                            </div>
                        </>
                    }
                    // Fix %.
                    processedData.forEach(i => {
                        if (i.value !== FAKE_NUMBER) {
                            // Cleanup the number just in case its reported in the wrong range (0 to 100). 
                            if (i.value > 1) {
                                i.value = i.value / 100;
                            }
                            i.value = intl.formatNumber(i.value * 100);
                            i.textValue = "" + i.value;
                        } else {
                            i.value = "MD";
                            i.textValue = FAKE_NUMBER;
                        }
                    });
                    max = 100;
                    dataSuffix = "%";
                    break;
            }
            break;
        case NUMBER_OF_ACTIVE_BREEDERS:
            getTooltipHeader = (d) => {
                const cropName = d.id.replace(`${d.indexValue}_`, "");
                return <>
                    <div className="header-top">
                        <div className={`${cropName} crop-icon`} />
                        <div className="crop-name">{`${intl.formatMessage({
                            id: cropName,
                            defaultMessage: cropName
                        })} ${d.indexValue}`}</div>
                    </div>
                    <div className="sub-header">
                        <span className="bold"> {d.data[d.id]}  </span><span>{intl.formatMessage({
                        id: "active-breeders",
                        defaultMessage: "active breeders"
                    })}</span>
                    </div>
                </>
            }
            getTooltipText = (d) => {
                const cropName = d.id.replace(`${d.indexValue}_`, "");
                let gaugeValue = data.otherValues[d.indexValue] ? data.otherValues[d.indexValue][cropName] : '';
                let suffix = null;
                if (!Number(gaugeValue) || gaugeValue === '') {
                    gaugeValue = 'MD';
                } else {
                    gaugeValue = Math.round(gaugeValue);
                    suffix = '%';
                }
                const dataGauge = [
                    { id: "EP", value: 20 },
                    { id: "P", value: 20 },
                    { id: "F", value: 20 },
                    { id: "G", value: 20 },
                    { id: "E", value: 20 }
                ];
                const r = range.find(r => gaugeValue >= r.min && gaugeValue <= r.max);
                let innerColor = "#818181";
                const particularGauge = [...dataGauge].map(i => ({ ...i }));
                if (r) {
                    particularGauge[r.position - 1].id = particularGauge[r.position - 1].id + "_S";
                    innerColor = r.color;
                }
                return <>
                    <div><span>{intl.formatMessage({
                        id: "tooltip-industry-opinion-on-adequacy-of-breeders",
                        defaultMessage: "Industry opinion on adequacy of breeders"
                    })}</span></div>
                    <Gauge data={particularGauge} height={45} width={105} innerValue={gaugeValue}
                           innerColor={innerColor} suffix={suffix} />
                </>
            }
            extraTooltipClass = "NUMBER_OF_ACTIVE_BREEDERS";
            useFilterByYear = false;
            indexBy = 'year';
            leftLegend = intl.formatMessage({ id: 'year-legend', defaultMessage: 'Year' });
            layout = 'horizontal';
            addLighterDiv = false;
            withCropsWithSpecialFeatures = false;
            bottomLegend = intl.formatMessage({
                id: 'number-of-breeders-legend',
                defaultMessage: 'Number of Breeders'
            });
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
                    <div><span>{intl.formatMessage({
                        id: 'package-size-tooltip',
                        defaultMessage: 'Package size'
                    })}: </span>
                        <span className="bold">{intl.formatMessage({
                            id: packageName + '-tooltip',
                            defaultMessage: packageName
                        })}</span></div>
                    <div><span>{intl.formatMessage({ id: 'percentage-legend', defaultMessage: 'Percentage' })}: </span>
                        <span className="bold"> {d.data[d.id]}</span></div>
                </>
            }
            indexBy = 'crop';
            leftLegend = intl.formatMessage({ id: 'crop-legend', defaultMessage: 'Crop' });
            layout = 'horizontal';
            addLighterDiv = false;
            withCropsWithSpecialFeatures = false;
            useFilterByYear = true;
            useFilterByCrops = false;
            totalLabel.show = false;
            showTotalMD = true;
            bottomLegend = intl.formatMessage({ id: 'percentage-legend', defaultMessage: 'Percentage (%)' });
            enableGridX = true;
            enableGridY = false;
            customTickWithCropsLeft = true;
            legend = genericLegend;
            legendTitle = intl.formatMessage({ id: 'package-size-legend', defaultMessage: 'Package Sizes' });
            margins = { top: 50, right: 60, bottom: 70, left: 160 }
            availabilitySeedSmallPackages();
            break;
        case MARKET_CONCENTRATION_HHI:
            useCropLegendsRow = false;
            useFilterByCrops = false;
            bottomLegend = '';
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
            radarTooltip = (d) => {
                return (<div className="tooltip-container-radar">
                    <div className="header-container">
                        <div className="header">
                            <div className={'name'}>{d.index}</div>
                        </div>
                    </div>
                    <div className="content">
                        <table width="100%">
                            <tbody>
                            {d.data.sort((a, b) => a.id.localeCompare(b.id))
                                .map(i => {
                                    return (
                                        <tr key={i.id}>
                                            <td>
                                                <div className={'circle'} style={{ background: i.color }} />
                                            </td>
                                            <td><span>{i.id}</span></td>
                                            <td>
                                                    <span>
                                                        <strong>{i.value !== FAKE_NUMBER ? i.value + '%' : 'MD'}</strong>
                                                    </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>)
            }
            break;
        case RATING_GOVERNMENT_SEED_SUBSIDY_PROGRAM:
            indexBy = "id";
            legend = "country";
            useFilterByCrops = false;
            useFilterByYear = false;
            useFilterByCountries = true;
            maxSelectableCountries = 3;
            withCropsWithSpecialFeatures = false;
            yearsColors = performanceColors;
            legendTitle = intl.formatMessage({ id: 'label-country' });
            customCrossCountryLegend = () => {
                return (<Grid.Row className={`crops-with-icons`} style={{ borderTop: 'none' }}>
                    <Grid.Column width={16}>
                        <div style={{
                            width: 'max-content',
                            float: "left",
                            marginTop: '10px'
                        }}>
                            <GenericLegend colors={colors} keys={keys} title={legendTitle} />
                        </div>
                    </Grid.Column>
                </Grid.Row>);
            };
            margins = { top: 50, right: 80, bottom: 30, left: 80 };
            radarTooltip = (d) => {
                return (<div className="tooltip-container-radar">
                    <div className="header-container">
                        <div className="header">
                            <div className={'name'}>{d.index}</div>
                        </div>
                    </div>
                    <div className="content">
                        <table width="100%">
                            <tbody>
                            {d.data.sort((a, b) => a.id.localeCompare(b.id))
                                .map(i => {
                                    return (<tr key={i.id}>
                                        <td>
                                            <div className={'circle'} style={{ background: i.color }} />
                                        </td>
                                        <td style={{ textAlign: "center" }}><span>{i.id}</span></td>
                                        <td>
                                            <span>
                                                <strong>{i.value !== FAKE_NUMBER ? i.value + '%' : 'MD'}</strong>
                                            </span>
                                        </td>
                                    </tr>);
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>)
            }
            processForRadarCrossCountry(data.dimensions.rating.values, true)
            break;
        case EFFICIENCY_SEED_IMPORT_PROCESS:
        case EFFICIENCY_SEED_EXPORT_PROCESS:
            useCropLegendsRow = false;
            useFilterByCrops = false;
            let tooltipSubText = '';
            switch (type) {
                case EFFICIENCY_SEED_IMPORT_PROCESS:
                    leftLegend = intl.formatMessage({
                        id: 'chart-label-length-of-import',
                        defaultMessage: 'Length of import process (days)'
                    });
                    tooltipSubText = intl.formatMessage({ id: 'days-for-import', defaultMessage: 'Days for Import' });
                    subLabel = 'Length of import process (days)';
                    legends = [{ id: 1, 'color': barPieColor[1], 
                        'label': intl.formatMessage({
                            id: 'number-of-days-for-import',
                            defaultMessage: 'Number of days for import'
                        }) },
                        { id: 2, 'color': barPieColor[0], 
                            'label': intl.formatMessage({ id: 'industry-rating', defaultMessage: 'Industry rating' }) }
                    ];
                    noDataLabelId = "no-reported-imports";
                    break;
                case EFFICIENCY_SEED_EXPORT_PROCESS:
                    leftLegend = intl.formatMessage({
                        id: 'chart-label-length-of-export',
                        defaultMessage: "Length of export process (days)"
                    });
                    tooltipSubText = intl.formatMessage({ id: 'number-of-days', defaultMessage: 'Number of days' });
                    subLabel = 'Length of export process (days)';
                    legends = [{
                        id: 1,
                        'color': barPieColor[1],
                        'label': intl.formatMessage({
                            id: 'number-of-days-for-export',
                            defaultMessage: 'Number of days for export'
                        })
                    },
                        {
                            id: 2,
                            'color': barPieColor[0],
                            'label': intl.formatMessage({ id: 'industry-rating', defaultMessage: 'Industry rating' })
                        }
                    ];
                    noDataLabelId = "no-reported-exports";
                    break;
                default:
                    leftLegend = 'insert legend here';
            }
            indexBy = 'year';
            bottomLegend = intl.formatMessage({ id: 'year-legend', defaultMessage: 'Year' });
            groupMode = 'grouped';
            rightLegend = intl.formatMessage({ id: 'rating-legend', defaultMessage: 'Rating out of 100 (%)' });
            keys.push(['value']);
            Object.keys(data.values.days).forEach(y => {
                const item = { year: y };
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
                return <div style={{ textAlign: 'center' }}>
                    <span>{tooltipSubText}</span>
                    <span className="bold"> {d.data[d.id] !== FAKE_NUMBER ? d.data[d.id] : 'MD'}</span>
                </div>
            }
            getTooltipHeader = (d) => {
                return <>
                    <div className={d.indexValue + " crop-icon"} />
                    <div className="crop-name">{intl.formatMessage({
                        id: d.indexValue,
                        defaultMessage: d.indexValue
                    })}</div>
                </>;
            }
            break;
        case NUMBER_SEED_INSPECTORS:
            useCropLegendsRow = false;
            useFilterByCrops = false;
            leftLegend = intl.formatMessage({
                id: 'number-seed-inspectors-legend',
                defaultMessage: 'Number of seed inspectors'
            });
            indexBy = 'year';
            bottomLegend = intl.formatMessage({ id: 'year-legend', defaultMessage: 'Year' });
            groupMode = 'stacked';
            rightLegend = intl.formatMessage({ id: 'rating-legend', defaultMessage: 'Rating out of 100 (%)' });
            keys.push('public', 'private');
            Object.keys(data.values).forEach(y => {
                const item = { year: y };
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
                return <>
                    <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'tooltip-private-inspectors-legend',
                            defaultMessage: 'Private seed inspectors'
                        })} </span>
                        <span className="bold"> {private_ !== FAKE_NUMBER ? private_ : 'MD'}</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'tooltip-public-inspectors-legend',
                            defaultMessage: 'Public seed inspectors'
                        })} </span>
                        <span className="bold"> {public_ !== FAKE_NUMBER ? public_ : 'MD'}</span>
                    </div>
                </>
            }
            getTooltipHeader = (d) => {
                return <>
                    <div className={d.indexValue + " crop-icon"} />
                    <div className="crop-name">{intl.formatMessage({
                        id: d.indexValue,
                        defaultMessage: d.indexValue
                    })}</div>
                </>;
            }
            legends = [{
                id: 1,
                'color': barPieColor[1],
                'label': intl.formatMessage({ id: 'public-inspectors-legend', defaultMessage: 'Public inspectors' })
            },
                {
                    id: 2,
                    'color': barPieColor[2],
                    'label': intl.formatMessage({
                        id: 'private-inspectors-legend',
                        defaultMessage: 'Private inspectors'
                    })
                },
                {
                    id: 3,
                    'color': barPieColor[0],
                    'label': intl.formatMessage({
                        id: 'industry-opinion-legend',
                        defaultMessage: 'Industry opinion rating (adequacy) (out of 100%)'
                    })
                }
            ];
            totalLabel.show = true;
            lineChartFieldLabel = intl.formatMessage({
                id: 'industry-opinion-legend-tooltip',
                defaultMessage: 'Industry opinion rating'
            });
            break;
        case VARIETY_RELEASE_PROCESS:
            useCropLegendsRow = false;
            useFilterByCrops = false;
            useFilterByYear = false;
            lineTooltipSuffix = '%';
            leftLegend = intl.formatMessage({
                id: 'number-months-axis',
                defaultMessage: 'Length of variety release process (months)'
            });
            indexBy = 'year';
            bottomLegend = intl.formatMessage({ id: 'year-legend', defaultMessage: 'Year' });
            groupMode = 'stacked';
            rightLegend = intl.formatMessage({ id: 'rating-legend', defaultMessage: 'Rating out of 100 (%)' });
            keys.push('time');
            Object.keys(data.values).forEach(y => {
                const item = { year: y };
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
            lineChartFieldLabel = intl.formatMessage({
                id: 'satisfaction-release-tooltip',
                defaultMessage: 'Satisfaction with variety release'
            });
            colors.set('time', barPieColor[1])
            getTooltipText = (d) => {
                return <>
                    <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'number-months-tooltip',
                            defaultMessage: 'Length of variety release process (months)'
                        })} </span>
                        <span className="bold"> {d.data.time !== FAKE_NUMBER ? d.data.time : "MD"}</span>
                    </div>
                </>
            }
            getTooltipHeader = (d) => {
                return <>
                    <div className={d.indexValue + " crop-icon"} />
                    <div className="crop-name">{intl.formatMessage({
                        id: d.indexValue,
                        defaultMessage: d.indexValue
                    })}</div>
                </>;
            }
            legends = [{
                id: 1,
                'color': barPieColor[1],
                'label': intl.formatMessage({
                    id: 'number-months-legend',
                    defaultMessage: 'Length of variety release process'
                })
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
            leftLegend = intl.formatMessage({
                id: 'number-households-legend',
                defaultMessage: 'Number of households"'
            });
            indexBy = 'year';
            bottomLegend = intl.formatMessage({ id: 'year-legend', defaultMessage: 'Year' });
            groupMode = 'stacked';
            rightLegend = intl.formatMessage({ id: 'rating-legend', defaultMessage: 'Rating out of 100 (%)' });
            keys.push('households');
            Object.keys(data.values).forEach(y => {
                const item = { year: y };
                if (selectedYear && selectedYear.find(k => k === y)) {
                    item.households = Number(data.values[y].households) >= 0 ? data.values[y].households : FAKE_NUMBER;
                    item.agrodealers = Number(data.values[y]["agrodealers-number"]) >= 0 ? data.values[y]["agrodealers-number"] : FAKE_NUMBER;
                    item.rating = Number(data.values[y].rating) >= 0 ? data.values[y].rating : FAKE_NUMBER;
                    if (item.households > max) {
                        max = item.households;
                    }
                    processedData.push(item);
                }
            });
            lineChartField = 'rating';
            lineChartFieldLabel = intl.formatMessage({
                id: 'industry-opinion-rating-legend',
                defaultMessage: 'Industry opinion rating'
            });
            colors.set('households', barPieColor[1])
            getTooltipText = (d) => {
                return <>
                    <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'agricultural-households-tooltip',
                            defaultMessage: 'Agricultural households/agro-dealer'
                        })} </span>
                        <span
                            className="bold"> {d.data.households !== FAKE_NUMBER ? `${intl.formatNumber(d.data.households, defaultFormat)} ` : "MD"}</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'number-agrodealers-tooltip',
                            defaultMessage: 'Number of agro-dealers'
                        })} </span>
                        <span className="bold"> {d.data.agrodealers !== FAKE_NUMBER ? intl.formatNumber(d.data.agrodealers, defaultFormat) : "MD"}</span>
                    </div>
                </>
            }
            getTooltipHeader = (d) => {
                return <>
                    <div className={d.indexValue + " crop-icon"} />
                    <div className="crop-name">{intl.formatMessage({
                        id: d.indexValue,
                        defaultMessage: d.indexValue
                    })}</div>
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
            leftLegend = intl.formatMessage({
                id: 'number-households-legend',
                defaultMessage: 'Number of households"'
            });
            indexBy = 'year';
            bottomLegend = intl.formatMessage({ id: 'year-legend', defaultMessage: 'Year' });
            groupMode = 'stacked';
            rightLegend = intl.formatMessage({ id: 'rating-legend', defaultMessage: 'Rating out of 100 (%)' });
            keys.push('households');
            Object.keys(data.values).forEach(y => {
                const item = { year: y };
                if (selectedYear && selectedYear.find(k => k === y)) {
                    item.households = Number(data.values[y].households) >= 0 ? data.values[y].households : FAKE_NUMBER;
                    item.rating = Number(data.values[y].rating) >= 0 ? data.values[y].rating : FAKE_NUMBER;
                    if (item.households > max) {
                        max = item.households;
                    }
                    processedData.push(item);
                }
            });
            lineChartField = 'rating';
            lineChartFieldLabel = intl.formatMessage({
                id: 'industry-opinion-rating-legend',
                defaultMessage: 'Industry opinion rating'
            });
            colors.set('households', barPieColor[1])
            getTooltipText = (d) => {
                return <>
                    <div style={{ textAlign: 'center' }}>
                        <span>{intl.formatMessage({
                            id: 'households-per-officer-tooltip',
                            defaultMessage: 'Households per extension officer'
                        })} </span>
                        <span
                            className="bold"> {d.data.households !== FAKE_NUMBER ? `${intl.formatNumber(d.data.households, defaultFormat)} ` : "MD"}</span>
                    </div>
                </>
            }
            getTooltipHeader = (d) => {
                return <>
                    <div className={d.indexValue + " crop-icon"} />
                    <div className="crop-name">{intl.formatMessage({
                        id: d.indexValue,
                        defaultMessage: d.indexValue
                    })}</div>
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
        case NUMBER_OF_VARIETIES_RELEASED: {
            withCropsWithSpecialFeatures = false;
            useFilterByYear = false;
            addLighterDiv = false;
            bottomLegend = intl.formatMessage({ id: 'year-legend', defaultMessage: 'Year' });
            leftLegend = intl.formatMessage({
                id: 'number-of-varieties-released',
                defaultMessage: 'Number of varieties released'
            });
            lineTooltip = (d) => {
                return (<div className="tooltip-container-var-release">
                    <div className="header-container">
                        <div className="header">
                            <div className="inner-container">
                                <div className={d.point.serieId.toLowerCase() + " crop-icon"} />
                                <div className="crop-name">{intl.formatMessage({
                                    id: d.point.serieId,
                                    defaultMessage: d.point.serieId
                                })}</div>
                            </div>
                            <div className="table">
                                <label style={{ float: 'left' }} className="year">{intl.formatMessage({
                                    id: 'tooltip-year',
                                    defaultMessage: 'Year'
                                })}</label>
                                <label style={{ float: 'right' }} className="vr">{intl.formatMessage({
                                    id: 'tooltip-varieties-released',
                                    defaultMessage: 'Varieties released'
                                })}</label>
                            </div>
                        </div>
                    </div>
                    <div className="amount-container">
                        <table width="100%">
                            <tr>
                                <td className="year">{d.point.data.x}</td>
                                <td style={{ fontWeight: 'bold' }}>{data.otherValues[d.point.data.x] ? data.otherValues[d.point.data.x][d.point.serieId] : 'MD'}</td>
                            </tr>
                            <tr>
                                <td className="year">{d.point.data.x - 1}</td>
                                <td style={{ fontWeight: 'bold' }}>{data.otherValues[d.point.data.x - 1] ? data.otherValues[d.point.data.x - 1][d.point.serieId] : 'MD'}</td>
                            </tr>
                            <tr>
                                <td className="year">{d.point.data.x - 2}</td>
                                <td style={{ fontWeight: 'bold' }}>{data.otherValues[d.point.data.x - 2] ? data.otherValues[d.point.data.x - 2][d.point.serieId] : 'MD'}</td>
                            </tr>
                            <tr>
                                <td className="average">{intl.formatMessage({
                                    id: 'tooltip-average',
                                    defaultMessage: 'Average'
                                })}</td>
                                <td className="total">{d.point.data.y}</td>
                            </tr>
                        </table>
                    </div>
                </div>)
            }
            processNumberVarietiesSold();
            break;
        }
    }

    const insertChart = () => {
        switch (type) {
            case NUMBER_OF_VARIETIES_RELEASED:
                return <Grid.Row className={`chart-section`}>
                    <Grid.Column width={16}><ResponsiveLineChartImpl
                        sources={sources}
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
                        showTotalLabel={totalLabel.show}
                        containerHeight={containerHeight || 450}
                        showTotalMD={showTotalMD}
                        margins={margins}
                        intl={intl}
                        tooltip={lineTooltip}
                    /></Grid.Column></Grid.Row>
                break;
            case MARKET_CONCENTRATION_HHI:
                return <MarketConcentrationHHI data={data} selectedYear={selectedYear} bottomLegend={bottomLegend}
                                               intl={intl} totalLabel={totalLabel} />
            case NUMBER_SEED_INSPECTORS:
            case VARIETY_RELEASE_PROCESS:
            case AGRODEALER_NETWORK:
            case AGRICULTURAL_EXTENSION_SERVICES:
            case EFFICIENCY_SEED_IMPORT_PROCESS:
            case EFFICIENCY_SEED_EXPORT_PROCESS:
                lineTooltipSuffix = '%';
                return <BarAndLineChart data={data} selectedYear={selectedYear} leftLegend={leftLegend}
                                        indexBy={indexBy} groupMode={groupMode} bottomLegend={bottomLegend}
                                        rightLegend={rightLegend} processedData={processedData} colors={colors}
                                        max={max} keys={keys} getTooltipText={getTooltipText}
                                        getTooltipHeader={getTooltipHeader} lineColor={barPieColor[0]}
                                        legends={legends} lineChartField={lineChartField}
                                        lineChartFieldLabel={lineChartFieldLabel}
                                        totalLabel={totalLabel} extraTooltipClass={extraTooltipClass}
                                        intl={intl}
                                        noDataLabelId={noDataLabelId}
                                        lineTooltipSuffix={lineTooltipSuffix}
                                        isCrossCountryChart={isCrossCountryChart}
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
                            tooltip={radarTooltip}
                        /></Grid.Column>
                </Grid.Row>
            case RATING_GOVERNMENT_SEED_SUBSIDY_PROGRAM:
                return <Grid.Row className={`chart-section`}>
                    <Grid.Column width={16} className={`radar`}>
                        <ResponsiveRadarChartImpl
                            noData={noData}
                            selectedCountry={countries}
                            processedData={processedData}
                            keys={keys}
                            colors={colors}
                            indexBy={indexBy}
                            intl={intl}
                            margin={margins}
                            tooltip={radarTooltip}
                        /></Grid.Column>
                </Grid.Row>
            default:
                return (<Grid.Row className={`chart-section`}>
                    <Grid.Column width={16}>
                        {!switchToLineChart ?
                            <ResponsiveBarChartImpl sources={sources} data={data} noData={noData} crops={crops}
                                                    selectedYear={selectedYear} colors={colors} max={max * 1.1}
                                                    keys={keys}
                                                    processedData={processedData} indexBy={indexBy} layout={layout}
                                                    groupMode={groupMode}
                                                    leftLegend={leftLegend} bottomLegend={bottomLegend}
                                                    enableGridX={enableGridX} enableGridY={enableGridY}
                                                    getTooltipText={getTooltipText} getTooltipHeader={getTooltipHeader}
                                                    customTickWithCropsBottom={customTickWithCropsBottom}
                                                    customTickWithCropsLeft={customTickWithCropsLeft}
                                                    dataSuffix={dataSuffix}
                                                    totalLabel={totalLabel}
                                                    containerHeight={containerHeight || 450}
                                                    showTotalMD={showTotalMD} margins={margins}
                                                    intl={intl} barLabelFormat={roundNumbers}
                                                    getColorsCustom={getColors} extraTooltipClass={extraTooltipClass}
                                                    animate={animate} customSorting={customSorting}
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
                                                          totalLabel={totalLabel}
                                                          containerHeight={containerHeight || 450}
                                                          showTotalMD={showTotalMD}
                                                          margins={margins}
                                                          intl={intl}
                                                          tooltip={lineTooltip}
                            />}
                    </Grid.Column>
                </Grid.Row>);
        }
    }

    let initialSelectedCrops = null;
    let initialSelectedCrop = null;
    if (sharedCrops) {
        initialSelectedCrops = [];
        initialCrops.forEach(i => {
            if (sharedCrops.includes(i)) {
                initialSelectedCrops.push(1);
            } else {
                initialSelectedCrops.push(0);
            }
        });
    } else {
        if (isCrossCountryChart) {
            initialSelectedCrop = 0;
            if (initialCrops && initialCrops.forEach) {
                initialCrops.forEach((i, index) => {
                    if (i === MAIZE) {
                        initialSelectedCrop = index;
                    }
                });
            }
        } else {
            if (!noData && initialCrops && Array.from(initialCrops).length > 0) {
                initialSelectedCrops = [];
                initialCrops.forEach(i => {
                    initialSelectedCrops.push(1);
                });
            }
        }
    }

    const generateFilters = () => {
        if (isCrossCountryChart) {
            if (useFilterByCropsWithCountries) {
                return (
                    <Grid.Row className={`filters-section`} style={{ borderBottom: "1px solid rgb(229, 229, 229)" }}>
                        <Grid.Column computer={4} mobile={16}>
                            <CrossCountryCropFilter data={initialCrops} onChange={handleCrossCountryCropFilterChange}
                                                    initialSelectedCrop={initialSelectedCrop} intl={intl} />
                        </Grid.Column>
                        <Grid.Column computer={5} mobile={16}>
                            <CrossCountryCountryFilter data={countries} onChange={handleCrossCountryCountryFilterChange}
                                                       intl={intl} />
                        </Grid.Column>
                    </Grid.Row>);
            } else if (useFilterByCountries) {
                return (
                    <Grid.Row className={`filters-section`} style={{ borderBottom: "1px solid rgb(229, 229, 229)" }}>
                        <Grid.Column computer={5} mobile={16}>
                            <CrossCountryCountryFilter data={countries} onChange={handleCrossCountryCountryFilterChange}
                                                       intl={intl} maxSelectable={maxSelectableCountries} />
                        </Grid.Column>
                    </Grid.Row>);
            } else {
                return null;
            }
        } else {
            if (useFilterByCrops || useFilterByYear) {
                return (<Grid.Row className={`filters-section`}>
                    {!noData && useFilterByCrops ? <Grid.Column computer={3} mobile={16}>
                        <CropFilter data={initialCrops} onChange={handleCropFilterChange}
                                    initialSelectedCrops={initialSelectedCrops} intl={intl} />
                    </Grid.Column> : null}
                    {(useFilterByYear) ? <Grid.Column computer={3} mobile={16}>
                        <YearsFilter data={years} onChange={handleYearFilterChange} maxSelectable={maxSelectableYear}
                                     defaultSelected={selectedYear} showMaxYearsMessage={showMaxYearsMessage} />
                    </Grid.Column> : null}
                </Grid.Row>);
            } else {
                return null;
            }
        }
    }

    const generateLegends = () => {
        if (isCrossCountryChart) {
            if (useHHILegends) {
                return (<Grid.Row className={`hhi-section`}>
                    <HHILegend legends={hhiLegends} title={'HHI Value'} />
                </Grid.Row>);
            }
            if (customCrossCountryLegend) {
                return customCrossCountryLegend();
            }
            return null;
        } else {
            if (!noData && useCropLegendsRow) {
                const cropsLegendTranslated = intl.formatMessage({
                    id: 'crops-legend',
                    defaultMessage: 'Crops'
                });
                return (<Grid.Row className={`crops-with-icons`}>
                    <Grid.Column width={8}>
                        {legend === 'crops' &&
                            <CropsLegend data={selectedCrops} title={cropsLegendTranslated} titleClass="crops-title"
                                         addLighterDiv={addLighterDiv}
                                         intl={intl} />}
                        {legend && legend.toLowerCase() === 'year' &&
                            <YearLegend colors={yearsColors} years={selectedYear} intl={intl} />}
                        {legend && legend === genericLegend &&
                            <GenericLegend colors={colors} keys={keys} title={legendTitle} />}
                    </Grid.Column>
                    <Grid.Column width={8}>
                        {withCropsWithSpecialFeatures && <CropsWithSpecialFeatures />}
                    </Grid.Column>
                </Grid.Row>);
            } else {
                return null;
            }
        }
    }

    return (<div ref={ref}>
        <Grid className={`number-varieties-released`}>
            <Grid.Row className="header-section">
                <Grid.Column width={12}>
                    <Header title={`${title}`} subtitle={subTitle} />
                </Grid.Column>
                <Grid.Column width={4}>
                    <Export methodology={methodology} exportPng={exportPng} download={download} containerRef={ref}
                            type={'bar'} chartType={type} selectedCrops={selectedCrops} selectedYear={selectedYear} />
                </Grid.Column>
            </Grid.Row>
            {generateFilters()}
            {generateLegends()}
            {insertChart()}
            <Grid.Row className={`source-section ${hasNotes ? ' no-bottom-border' : ''}`}>
                <Grid.Column>
                    <Source title={`Source: ${sources}${editing ? ` *${type}*` : ''}`} />
                </Grid.Column>
            </Grid.Row>
            <Notes chardIdCategory={categoryType ? categoryType.id : undefined} setHasNotes={setHasNotes}
                   isCrossCountryChart={isCrossCountryChart} />
        </Grid>
    </div>);
}

const barColors = [
    '#82c341', '#21686e', '#f48e27', '#f0cc16', '#385e2e'
];
const performanceColors = [
    '#4D843F', '#F39C00', '#E36A6A', '#289DF5', '#FBCC2A'
];
const barPieColor = [
    '#c2db24', '#41a9d9', '#43758D'
];
const crossCountryBarColor = [
    '#82C341', '#F49739'
];
const packageBarColor = [
    '#9D9D9D', '#F2CA05', '#EE912B', '#85AA2B', '#5F92C1'
];

export const FAKE_NUMBER = 0.001;

const mapStateToProps = (state) => {
    return { filters: state.getIn(['data', 'filters']), }
}
const mapActionCreators = {}
export default connect(mapStateToProps, mapActionCreators)(injectIntl(ChartComponent))
