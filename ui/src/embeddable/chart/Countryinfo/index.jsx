import React from "react";
import { Grid } from "semantic-ui-react";
import millify from "millify";
import './CountryInfo.scss';
import CountryInfoChart from "./CountryInfoChart";
import { injectIntl } from "react-intl";

const CountryInfo = ({ data, intl, labels, locale }) => {
    const config = {
        precision: 2,
        lowercase: true,
        space: true,
        units: ["", "thousand", "million", "billion", "trillion"],
    }

    const NA = 'N/A';

    const getSymbol = (suffix) => {
        let symbol = '';
        if (suffix && suffix.length > 0) {
            symbol = intl.formatMessage({
                id: `symbol-${suffix}`,
                defaultMessage: ''
            })
        }
        return symbol;
    }

    const getValue = (field) => {
        if (field && field.value) {
            if (field.value === 0) {
                return NA;
            }
            if (field.symbol === '%') {
                const format = { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 2 }
                // To fix inconsistent data, sometimes the values are in range [0-1] or [0-100]
                const multiplier = field.value < 1 ? 100 : 1;
                return `${intl.formatNumber(field.value * multiplier, format)} %`;
            } else {
                return millify(field.value, config) + getSymbol(field.symbol);
            }
        } else return NA;
    }

    const getOrderedCrops = () => {
        let aOrderedCrops = [];

        if (data) {
            aOrderedCrops =
                getCropsArray(data).sort((a, b) => {
                    if (a.value > b.value) {
                        return -1;
                    }
                    if (a.value < b.value) {
                        return 1;
                    }
                    return 0;
                });
        }
        return aOrderedCrops;
    }

    let enablingBusinessAgricultureRank = intl.formatMessage({
        id: 'enabling-the-business-of-agriculture-rank',
        defaultMessage: "Enabling the Business of Agriculture Rank"
    });
    if (data.easeAgricultureRankYear) {
        enablingBusinessAgricultureRank += " (" + data.easeAgricultureRankYear + "): "
    } else {
        enablingBusinessAgricultureRank += ": ";
    }
    enablingBusinessAgricultureRank += (getValue(data.easeAgricultureRank) !== 'N/A'
        ? `<span class='data'>${getValue(data.easeAgricultureRank)}</span> ${intl.formatMessage({
            id: "out-of",
            defaultMessage: "out of"
        })} 101 ${intl.formatMessage({
            id: "label-countries",
            defaultMessage: "countries"
        })}`
        : "<span class='data'>N/A</span>");
    let enablingBusinessAgricultureScore = intl.formatMessage({
        id: "enabling-the-business-of-agriculture-topics-core",
        defaultMessage: "Enabling the Business of Agriculture Topic Score"
    });
    if (data.easeAgricultureScoreYear) {
        enablingBusinessAgricultureScore += " (" + data.easeAgricultureScoreYear + "): ";
    } else {
        enablingBusinessAgricultureScore += ": ";
    }
    enablingBusinessAgricultureScore += (getValue(data.easeAgricultureScore) !== 'N/A'
        ? `<span class='data'>${getValue(data.easeAgricultureScore)}</span> ${intl.formatMessage({
            id: "out-of",
            defaultMessage: "out of"
        })} 100`
        : "<span class='data'>N/A</span>");

    let sourceText = "";
    let topHarvestedCropsAndValue = '';
    let populationVsFarmingHouseholds = '';
    let totalPopulationLabel = '';
    let farmingHouseholdsLabel = '';
    let totalLandArea = '';
    let totalLandAreaUnit = '';
    let arableLand = '';
    const currentLanguage = locale || 'en';
    if (currentLanguage === 'en') {
        if (cleanupParam(labels.sourceText_en)) {
            sourceText = labels.sourceText_en;
        } else {
            sourceText = cleanupParam(labels.sourceText_fr) || '';
        }
        if (cleanupParam(labels.topHarvestedCropsAndValue_en)) {
            topHarvestedCropsAndValue = labels.topHarvestedCropsAndValue_en;
        } else {
            topHarvestedCropsAndValue = cleanupParam(labels.topHarvestedCropsAndValue_fr) || '';
        }
        if (cleanupParam(labels.populationVsFarmingHouseholds_en)) {
            populationVsFarmingHouseholds = labels.populationVsFarmingHouseholds_en;
        } else {
            populationVsFarmingHouseholds = cleanupParam(labels.populationVsFarmingHouseholds_fr) || '';
        }
        if (cleanupParam(labels.totalPopulationLabel_en)) {
            totalPopulationLabel = labels.totalPopulationLabel_en;
        } else {
            totalPopulationLabel = cleanupParam(labels.totalPopulationLabel_fr) || '';
        }
        if (cleanupParam(labels.farmingHouseholdsLabel_en)) {
            farmingHouseholdsLabel = labels.farmingHouseholdsLabel_en;
        } else {
            farmingHouseholdsLabel = cleanupParam(labels.farmingHouseholdsLabel_fr) || '';
        }
        if (cleanupParam(labels.sourceText_en)) {
            sourceText = labels.sourceText_en;
        } else {
            sourceText = cleanupParam(labels.sourceText_fr) || '';
        }
        if (cleanupParam(labels.totalLandArea_en)) {
            totalLandArea = labels.totalLandArea_en;
        } else {
            totalLandArea = cleanupParam(labels.totalLandArea_fr) || '';
        }
        if (cleanupParam(labels.totalLandAreaUnit_en)) {
            totalLandAreaUnit = labels.totalLandAreaUnit_en;
        } else {
            totalLandAreaUnit = cleanupParam(labels.totalLandAreaUnit_fr) || '';
        }
        if (cleanupParam(labels.arableLand_en)) {
            arableLand = labels.arableLand_en;
        } else {
            arableLand = cleanupParam(labels.arableLand_fr) || '';
        }
    } else {
        if (cleanupParam(labels.sourceText_fr)) {
            sourceText = labels.sourceText_fr;
        } else {
            sourceText = cleanupParam(labels.sourceText_en) || '';
        }
        if (cleanupParam(labels.topHarvestedCropsAndValue_fr)) {
            topHarvestedCropsAndValue = labels.topHarvestedCropsAndValue_fr;
        } else {
            topHarvestedCropsAndValue = cleanupParam(labels.topHarvestedCropsAndValue_en) || '';
        }
        if (cleanupParam(labels.populationVsFarmingHouseholds_fr)) {
            populationVsFarmingHouseholds = labels.populationVsFarmingHouseholds_fr;
        } else {
            populationVsFarmingHouseholds = cleanupParam(labels.populationVsFarmingHouseholds_en) || '';
        }
        if (cleanupParam(labels.totalPopulationLabel_fr)) {
            totalPopulationLabel = labels.totalPopulationLabel_fr;
        } else {
            totalPopulationLabel = cleanupParam(labels.totalPopulationLabel_en) || '';
        }
        if (cleanupParam(labels.farmingHouseholdsLabel_fr)) {
            farmingHouseholdsLabel = labels.farmingHouseholdsLabel_fr;
        } else {
            farmingHouseholdsLabel = cleanupParam(labels.farmingHouseholdsLabel_en) || '';
        }
        if (cleanupParam(labels.totalLandArea_fr)) {
            totalLandArea = labels.totalLandArea_fr;
        } else {
            totalLandArea = cleanupParam(labels.totalLandArea_en) || '';
        }
        if (cleanupParam(labels.totalLandAreaUnit_fr)) {
            totalLandAreaUnit = labels.totalLandAreaUnit_fr;
        } else {
            totalLandAreaUnit = cleanupParam(labels.totalLandAreaUnit_en) || '';
        }
        if (cleanupParam(labels.arableLand_fr)) {
            arableLand = labels.arableLand_fr;
        } else {
            arableLand = cleanupParam(labels.arableLand_en) || '';
        }
    }

    return (
        <Grid className={`country-info`}>
            <Grid.Row className={`section totals`}>
                <Grid.Column width={10}>
                    <div className="label">{totalLandArea}</div>
                    <div
                        className="data">{data.agricLandArea && data.agricLandArea.value > 0 ? getValue(data.agricLandArea) + ` ${totalLandAreaUnit}` : NA}</div>
                </Grid.Column>
                <Grid.Column width={6}>
                    <div className="label">{arableLand}</div>
                    <div className="data">{getValue(data.arableLand)}</div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`section sub`}>
                <Grid.Column width={16}>
                    <div
                        className="section-title">{topHarvestedCropsAndValue + (data.year ? ' (' + data.year + ')' : '')}</div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`section sub`}>
                <Grid.Column width={12}>
                    <Grid>
                        {
                            getOrderedCrops().map((crop) => {
                                return <Grid.Column key={`${crop.label}`} width={8} className={'crop-container'}>
                                    <div className={`crop ${(crop.label).toLowerCase().replaceAll(" ", "-")}`}>
                                        <div className="label has-condensed-text">{`${intl.formatMessage({
                                            id: crop.label.toLowerCase(),
                                            defaultMessage: crop.label
                                        })} /
                                            ${intl.formatMessage({
                                            id: "label-in",
                                            defaultMessage: "label-in"
                                        })} ${intl.formatMessage({
                                            id: labels.topHarvestedCropsAndValueUnit.toLowerCase(),
                                            defaultMessage: labels.topHarvestedCropsAndValueUnit
                                        })}`}</div>
                                        <div className="data">{crop.value.toLocaleString() || NA}</div>
                                    </div>
                                </Grid.Column>
                            })
                        }
                    </Grid>
                </Grid.Column>
                <Grid.Column width={4}>
                    <div style={{ height: '100px' }}><CountryInfoChart rawData={data} /></div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row key={`gr-3`} className={`section sub border`}>
                <Grid.Column key={`gc-3-1`} width={16}>
                    <div className="section-title">{populationVsFarmingHouseholds}</div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`section sub`}>
                <Grid.Column width={8}>
                    <div className="household-data population">
                        <div
                            className="label has-condensed-text">{totalPopulationLabel + (data.year ? ' (' + data.year + ')' : '')}</div>
                        <div className="data large">
                            <div
                                className="data-value">{getValue(data.population)}</div>
                        </div>
                    </div>
                </Grid.Column>
                <Grid.Column width={8}>
                    <div className="household-data households">
                        <div
                            className="label has-condensed-text">{farmingHouseholdsLabel + (data.year ? ' (' + data.year + ')' : '')}</div>
                        <div className="data large">
                            <div
                                className="data-value ">{getValue(data.farmingHouseholds)}</div>
                        </div>
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`section border`}>
                <Grid.Column width={16} className={`business-rank`}>
                    {data.business && <div className="label">Ease of Doing Business Rank (2020) :
                        <span className="data"> {data.business ? data.business.value : NA}</span> of 100
                    </div>}
                    <div className="label" dangerouslySetInnerHTML={{ __html: enablingBusinessAgricultureScore }} />
                    <div className="label" dangerouslySetInnerHTML={{ __html: enablingBusinessAgricultureRank }} />
                </Grid.Column>
            </Grid.Row>
            {labels.sourceText_en ? <Grid.Row className={`section border`}>
                <Grid.Column width={16} className={`country_info_source`}>
                    <div className="label" dangerouslySetInnerHTML={{ __html: decodeURI(sourceText) }} />
                </Grid.Column>
            </Grid.Row> : null}
        </Grid>
    )
}
export const getCropsArray = (rawData) => {
    if (rawData[`nameCrop1`]) {
        const newData = [...Array(4)].map((value, key) => {
            return {
                "id": (rawData[`nameCrop${key + 1}`] ? rawData[`nameCrop${key + 1}`] : "").replace(/\s+/g, '-').toLowerCase(),
                "label": rawData[`nameCrop${key + 1}`],
                "value": rawData[`harvestedCrop${key + 1}`] ? rawData[`harvestedCrop${key + 1}`].value : 0,
            }
        });
        return newData;
    } else {
        return [];
    }
}

export const cleanupParam = (param) => {
    let text = param;
    if (!text || text === '' || text === 'null' || text === 'undefined') {
        return '';
    }
    return text;
}


export default injectIntl(CountryInfo)
