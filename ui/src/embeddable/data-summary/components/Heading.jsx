import {Container, Grid, Icon} from "semantic-ui-react";
import React from "react";

const Heading = ({legends, title}) => {
    return (
        <>
            <Container fluid={true} className={"chart-heading"}>
                <Grid columns={16} stretched>
                    {title && <Grid.Row className="title">
                        <div>{title}</div>
                    </Grid.Row>}
                    {legends.map(legend => {
                        return <Grid.Row className="legends" key={legend.id}>
                            {legend.legend.map(l => {
                                return <Grid.Column width={l.width} key={l.id}
                                                    className={`${l.className ? l.className : ''}`}>
                                    <div>{l.color && <div className={'square ' + l.color}/>}
                                        {l.label}
                                    </div>
                                </Grid.Column>
                            })}
                        </Grid.Row>
                    })}
                    <Grid.Row className="legends" style={{backgroundColor: '#f9f9f9'}}>
                        <Grid.Column width={3}>
                            <div>MD: Indicator data missing</div>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <div>NA: Indicator not applicable</div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </>
    );
}
export default Heading;
