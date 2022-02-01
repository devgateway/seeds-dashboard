import React, { useState } from "react";
import AvailabilityOfBasicSeedChart from "./AvailabilityOfBasicSeedChart";
import { Grid } from "semantic-ui-react";
import Export from "../common/export";
import Header from "../common/header";
import Source from "../common/source";

import Heading from "../../data-summary/components/Heading";
import { legends } from "./components/LegendConstant";

const AvailabilityOfBasicSeed = ({ data, mostRecentYears, sources }) => {
  let yearsToShow;
  let noData = false;
  if (data && data.id) {
    yearsToShow = data.dimensions.year.values.sort((a, b) => {
      if (parseInt(a) < parseInt(b)) {
        return -1;
      }
      if (parseInt(a) > parseInt(b)) {
        return 1;
      }
      return 0;
    });
    if (yearsToShow.length > mostRecentYears) {
      yearsToShow = yearsToShow.slice(Math.max(yearsToShow.length - mostRecentYears, 1));
    }
  } else {
    noData = true;
  }
  return <Grid className={"availability-of-basic-seed-container"}>

      <Grid.Row className="header-section with-bottom-border chart-title">
          <Grid.Column wide width={12}>
          <div className="titles">
              <div className="title">Availability of Basic Seed <span className="subtitle">(seed company rating out of 100)</span></div>
          </div>
          </Grid.Column>
          <Grid.Column width={4}>
            <Export/>
          </Grid.Column>
      </Grid.Row>

    <Grid.Row className={"with-bottom-border border-left border-right"}><Heading legends={legends} /></Grid.Row>
    <Grid.Row className={"with-bottom-border border-left border-right"}>
      {!noData ?
        <AvailabilityOfBasicSeedChart data={data}
                                      yearsToShow={yearsToShow} /> : <div className={"no-data"}>No data</div>}
    </Grid.Row>
    <Grid.Row className={`source-section`}>
        <Grid.Column>
            <Source title={`Source: ${sources}`} />
        </Grid.Column>
    </Grid.Row>
  </Grid>
}
export default AvailabilityOfBasicSeed;
