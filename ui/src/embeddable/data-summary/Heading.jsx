import { Container, Grid, Icon } from "semantic-ui-react";
import React from "react";

const Heading = () => {
  return (<Container fluid={true} className={"data-summary-heading"}
    >
      <Grid columns={16} stretched>
        <Grid.Row className="title"><div>Data Summary: Country comparison</div></Grid.Row>
        <Grid.Row className="legends">
          <Grid.Column width={4}> <div>Color codes for opinion indicators</div></Grid.Column>
          <Grid.Column width={3}>
            <div><Icon name="stop" fitted className="dark-red" />Extremely poor (0-19.99)</div>
          </Grid.Column>
          <Grid.Column width={2}>
            <div><Icon name="stop" fitted className="red" />Poor (20-33.99)</div>
          </Grid.Column>
          <Grid.Column width={2}>
            <div><Icon name="stop" fitted className="yellow" />Fair (40-59.99)</div>
          </Grid.Column>
          <Grid.Column width={2}>
            <div><Icon name="stop" fitted className="green" />Good (60-79.99)</div>
          </Grid.Column>
          <Grid.Column width={3}>
            <div><Icon name="stop" fitted className="dark-green" />Excellent (80-100)</div>
          </Grid.Column>
        </Grid.Row>
      </Grid></Container>
  );
}
export default Heading;