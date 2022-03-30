import React from "react";
import { Grid } from "semantic-ui-react";
import millify from "millify";
import './CountryInfo.scss';
import CountryInfoChart from "./CountryInfoChart";
import { injectIntl } from "react-intl";

const CountryInfo = ({ data, intl, labels }) => {
    const config = {
        precision: 2,
        lowercase: true,
        space: true,
        units: ["", "thousand", "million", "billion", "trillion"],
    }

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
            if (field.symbol === '%') {
                const format = { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 2 }
                return `${intl.formatNumber(field.value * 100, format)} %`;
            } else {
                return millify(field.value, config) + getSymbol(field.symbol);
            }
        } else return '-';
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
    return (
        <Grid className={`country-info`}>
            <Grid.Row className={`section totals`}>
                <Grid.Column width={10}>
                    <div className="label">{labels.totalLandArea}</div>
                    <div
                        className="data">{getValue(data.agricLandArea) + ` ${labels.totalLandAreaUnit}`}</div>
                </Grid.Column>
                <Grid.Column width={6}>
                    <div className="label">{labels.arableLand}</div>
                    <div className="data">{getValue(data.arableLand)}</div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`section sub`}>
                <Grid.Column width={16}>
                    <div className="section-title">{labels.topHarvestedCropsAndValue}</div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`section sub`}>
                <Grid.Column width={12}>
                    <Grid>
                        {
                            getOrderedCrops().map((crop) => {
                                return <Grid.Column key={`${crop.label}`} width={8} className={'crop-container'}>
                                    <div className={`crop ${(crop.label).toLowerCase().replaceAll(" ", "-")}`}>
                                        <div className="label has-condensed-text">{crop.label} /
                                            in {labels.topHarvestedCropsAndValueUnit}</div>
                                        <div className="data">{crop.value.toLocaleString()}</div>
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
                    <div className="section-title">{labels.populationVsFarmingHouseholds}</div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`section sub`}>
                <Grid.Column width={8}>
                    <div className="household-data population">
                        <div className="label has-condensed-text">Total<br />Population</div>
                        <div className="data large">
                            <div
                                className="data-value">{getValue(data.population)}</div>
                        </div>
                    </div>
                </Grid.Column>
                <Grid.Column width={8}>
                    <div className="household-data households">
                        <div className="label has-condensed-text">Farming<br />Households</div>
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
                        <span className="data"> {data.business ? data.business.value : '-'}</span> of 100
                    </div>}
                    <div className="label">{labels.easeOfDoingBusinessAgriculture}
                        <span
                            className="data"> {data.easeAgriculture ? data.easeAgriculture.value : '-'}</span> {labels.easeOfDoingBusinessAgricultureOf}
                    </div>
                </Grid.Column>
            </Grid.Row>
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


export default injectIntl(CountryInfo)
