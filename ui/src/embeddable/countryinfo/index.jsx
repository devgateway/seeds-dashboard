import React from "react";
import { Grid } from "semantic-ui-react";

const CountryInfo = ({ data }) => {
    return (
        <Grid className={`land-data`}>
            <Grid.Row className={`section`}>
                <Grid.Column width={10}>
                    <span class="label">Total Land Area</span>
                    <span class="data">{ Number(data.landArea).toLocaleString() } Hectares</span>
                </Grid.Column>
                <Grid.Column width={6}>
                    <span class="label">Arable Land</span>
                    <span class="data">{ Number(data.arableLand).toLocaleString() }%</span>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`section`}>
                <Grid.Column width={16}>
                    <div class="section-title">Top Harvested Crops and Value</div>
                </Grid.Column>
                {
                    ["maize", "rice", "pea", "soy"].map((value, key) => {
                        return data["harvestedCrop" + (key + 1)] &&
                            <Grid.Column width={8}>
                                <div className={`crop ${value}`}>
                                    <div class="label"><span style={{ textTransform: 'capitalize' }}>{value}</span> / in hectares</div>
                                    <div class="data">{Number(data["harvestedCrop" + (key + 1)]).toLocaleString()}</div>
                                </div>
                            </Grid.Column>
                    })
                }
            </Grid.Row>
            <Grid.Row className={`section no-border`}>
                <Grid.Column width={16}>
                    <div class="section-title">Population vs Farming Households</div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`section`}>
                <Grid.Column width={8}>
                    <div class="household-icon orange"></div>
                    <div class="household-data">
                        <div class="label">Total<br/>Population</div>
                        <div class="data large"><span class="data-value">{ Number(data.population).toLocaleString() }</span></div>
                    </div>
                </Grid.Column>
                <Grid.Column width={8}>
                    <div class="household-icon"></div>
                    <div class="household-data">
                        <div class="label">Farming<br/>Households</div>
                        <div class="data large"><span class="data-value">{ Number(data.farmingHouseholds).toLocaleString() }</span></div>
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`section`}>
                <Grid.Column width={16} className={`business-rank`}>
                    <span class="label">Ease of Doing Business Rank (2020)</span>
                    <span class="data">{ data.business }</span><span class="label">of 190</span>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default CountryInfo
