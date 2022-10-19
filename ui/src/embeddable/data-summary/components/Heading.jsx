import { Container, Grid, Icon } from "semantic-ui-react";
import React from "react";
import { injectIntl } from "react-intl";

const Heading = ({ legends, title, showMDNALegends, intl }) => {
    return (
        <>
            <Container fluid={true} className={"chart-heading"} style={showMDNALegends ? { height: '250px' } : {}}>
                <Grid columns={16} stretched>
                    {title && <Grid.Row className="title">
                        <div>{title}</div>
                    </Grid.Row>}
                    {legends.map(legend => {
                        return <Grid.Row className="legends" key={legend.id}>
                            {legend.legend.map(l => {
                                return <Grid.Column width={l.width} key={l.id}
                                                    className={`${l.className ? l.className : ''}`}>
                                    <div>{l.color && <div className={'square ' + l.color} />}
                                        {l['label-key'] ? intl.formatMessage({
                                            id: l['label-key'],
                                            defaultMessage: l.label
                                        }) : l.label} {l['label-range']}
                                    </div>
                                </Grid.Column>
                            })}
                        </Grid.Row>
                    })}
                    {showMDNALegends ? <Grid.Row className="legends" style={{ backgroundColor: '#f9f9f9' }}>
                        <Grid.Column width={4}>
                            <div>{intl.formatMessage({id: 'md'})}: {intl.formatMessage({
                                id: "indicator-data-missing",
                                defaultMessage: "Indicator data missing"
                            })}</div>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <div>{intl.formatMessage({id: 'na'})}: {intl.formatMessage({
                                id: "indicator-not-applicable",
                                defaultMessage: "Indicator not applicable"
                            })}</div>
                        </Grid.Column>
                    </Grid.Row> : null}
                </Grid>
            </Container>
        </>
    );
}
export default injectIntl(Heading);
