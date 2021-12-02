import React, { useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import './IndicatorLabel.scss';

const IndicatorLabel = ({ field, className}) => {
  if (field) {
    return <Grid
      className={className}>
      <Grid.Column width={10}  className="label">{field.label}</Grid.Column>
      <Grid.Column width={6}  className="value">{field.value}</Grid.Column>
    </Grid>
  } else {
    return null
  }
}
export default IndicatorLabel;