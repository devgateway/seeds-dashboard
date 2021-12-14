import { Container, Grid, Icon } from "semantic-ui-react";
import React from "react";
import { legends } from "./LegendsConstants";

const Heading = () => {
  return (
    <>
      <Container fluid={true} className={"data-summary-heading"}>
        <Grid columns={16} stretched>
          <Grid.Row className="title">
            <div>Data Summary: Country comparison</div>
          </Grid.Row>
          {legends.map(legend => {
            return <Grid.Row className="legends" key={legend.id}>
              {legend.legend.map(l => {
                return <Grid.Column width={l.width} key={l.id}>
                  <div>{l.color && <Icon name="stop" fitted className={l.color} />}{l.label}</div>
                </Grid.Column>
              })}
            </Grid.Row>
          })}
        </Grid>
      </Container>

    </>
  );
}
export default Heading;