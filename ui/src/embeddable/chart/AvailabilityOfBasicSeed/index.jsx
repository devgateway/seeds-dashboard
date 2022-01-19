import React, { useState } from "react";
import AvailabilityOfBasicSeedChart from "./AvailabilityOfBasicSeedChart";
import { Grid } from "semantic-ui-react";

import Heading from "../../data-summary/components/Heading";
import { legends } from "./components/LegendConstant";

const AvailabilityOfBasicSeed = ({ data, mostRecentYears, sources }) => {
  let yearsToShow;
  if (data) {
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
  }
  return <Grid className={"availability-of-basic-seed-container"}>
    <Grid.Row className={"with-bottom-border chart-title"}><span>Availability of Basic Seed&nbsp;</span>(seed company
      rating
      out of 100)</Grid.Row>
    <Grid.Row className={"with-bottom-border border-left  border-right"}><Heading legends={legends} /></Grid.Row>
    <Grid.Row className={"with-bottom-border border-left border-right"}><AvailabilityOfBasicSeedChart data={data}
                                                                                                      yearsToShow={yearsToShow} /></Grid.Row>
    <Grid.Row className={"datasource-container border-left border-right"}>Source: {sources}</Grid.Row>
  </Grid>
}
export default AvailabilityOfBasicSeed;