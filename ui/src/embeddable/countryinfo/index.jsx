import React from "react";
import { Grid } from "semantic-ui-react";
import millify from "millify";

const CountryInfo = ({ data }) => {
    const config = {
        precision: 2,
        lowercase: true,
        space: true,
        units: ["", "thousand", "million", "billion", "trillion"],
    }
    return (
        <Grid className={`land-data`}>
            <Grid.Row key={`gr-1`} className={`section`}>
                <Grid.Column key={`gc-1-1`} width={10}>
                    <span className="label">Total Land Area</span>
                    <span className="data">{ millify(data.landArea, config) } Hectares</span>
                </Grid.Column>
                <Grid.Column key={`gc-1-2`} width={6}>
                    <span className="label">Arable Land</span>
                    <span className="data">{ Number(data.arableLand).toLocaleString() }%</span>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row key={`gr-2`} className={`section`}>
                <Grid.Column key={`gc-2-1`} width={16}>
                    <div className="section-title">Top Harvested Crops and Value</div>
                </Grid.Column>
                {
                    [...Array(4)].map((value, key) => {
                        return data["harvestedCrop" + (key + 1)] &&
                            data["nameCrop" + (key + 1)] &&
                            <Grid.Column  key={`gc-2-2-` + (key + 1)} width={8}>
                                <div className={`crop ${(data["nameCrop" + (key + 1)]).toLowerCase().replaceAll(" ", "-")}`}>
                                    <div className="label">{data["nameCrop" + (key + 1)]} / in hectares</div>
                                    <div className="data">{Number(data["harvestedCrop" + (key + 1)]).toLocaleString()}</div>
                                </div>
                            </Grid.Column>
                    })
                }
            </Grid.Row>
            <Grid.Row key={`gr-3`} className={`section no-border`}>
                <Grid.Column key={`gc-3-1`} width={16}>
                    <div className="section-title">Population vs Farming Households</div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row key={`gr-4`} className={`section`}>
                <Grid.Column key={`gc-4-1`} width={8}>
                    <div className="household-icon orange"></div>
                    <div className="household-data">
                        <div className="label">Total<br/>Population</div>
                        <div className="data large"><span className="data-value">{ millify(data.population, config) }</span></div>
                    </div>
                </Grid.Column>
                <Grid.Column key={`gc-4-2`} width={8}>
                    <div className="household-icon"></div>
                    <div className="household-data">
                        <div className="label">Farming<br/>Households</div>
                        <div className="data large"><span className="data-value">{ millify(data.farmingHouseholds, config) }</span></div>
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row key={`gr-5`} className={`section`}>
                <Grid.Column key={`gc-5-1`} width={16} className={`business-rank`}>
                    <span className="label">Ease of Doing Business Rank ({ data.year })</span>
                    <span className="data">{ data.business }</span><span className="label">of 190</span>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default CountryInfo