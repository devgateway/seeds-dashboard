import React from "react";
import { Grid } from "semantic-ui-react";
import millify from "millify";
import './CountryInfo.scss';
import CountryInfoChart from "./CountryInfoChart";

const CountryInfo = ({ data }) => {
  const config = {
    precision: 2,
    lowercase: true,
    space: true,
    units: ["", "thousand", "million", "billion", "trillion"],
  }
  return (
    <Grid className={`country-info`}>
      <Grid.Row className={`section totals`}>
        <Grid.Column width={10}>
          <div className="label">Total Land Area</div>
          <div className="data">{data.agricLandArea ? millify(data.agricLandArea, config) + " Hectares" : "-"}</div>
        </Grid.Column>
        <Grid.Column width={6}>
          <div className="label">Arable Land</div>
          <div className="data">{data.arableLand ? Number(data.arableLand).toLocaleString() + "%" : "-"}</div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className={`section`}>
        <Grid.Column width={16}>
          <div className="section-title">Top Harvested Crops and Value</div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className={`section`}>
        <Grid.Column width={12}>
          <Grid>
            {
              [...Array(4)].map((value, key) => {
                return data["harvestedCrop" + (key + 1)] &&
                  data["nameCrop" + (key + 1)] &&
                  <Grid.Column key={`gc-2-2-` + (key + 1)} width={8} className={'crop-container'}>
                    <div className={`crop ${(data["nameCrop" + (key + 1)]).toLowerCase().replaceAll(" ", "-")}`}>
                      <div className="label has-condensed-text">{data["nameCrop" + (key + 1)]} / in hectares</div>
                      <div className="data">{Number(data["harvestedCrop" + (key + 1)]).toLocaleString()}</div>
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
      <Grid.Row key={`gr-3`} className={`section border`}>
        <Grid.Column key={`gc-3-1`} width={16}>
          <div className="section-title">Population vs Farming Households</div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className={`section`}>
        <Grid.Column width={8}>
          <div className="household-data population">
            <div className="label has-condensed-text">Total<br />Population</div>
            <div className="data large">
              <div
                className="data-value">{data.population ? millify(data.population, config) : '-'}</div>
            </div>
          </div>
        </Grid.Column>
        <Grid.Column width={8}>
          <div className="household-data households">
            <div className="label has-condensed-text">Farming<br />Households</div>
            <div className="data large">
              <div
                className="data-value ">{data.farmingHouseholds ? millify(data.farmingHouseholds, config) : '-'}</div>
            </div>
          </div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className={`section border`}>
        <Grid.Column width={16} className={`business-rank`}>
          <div className="label">Ease of Doing Business Rank ({data.year ? data.year : '-'})
            <span className="data">{data.business ? data.business : '-'}</span> of 190
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default CountryInfo
