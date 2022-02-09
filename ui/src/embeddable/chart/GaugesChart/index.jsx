import React, {useState} from "react";
import AvailabilityOfBasicSeedChart from "./AvailabilityOfBasicSeedChart";
import {Grid} from "semantic-ui-react";
import Export from "../common/export";
import Source from "../common/source";

import Heading from "../../data-summary/components/Heading";
import {legends} from "./components/LegendConstant";
import {AVAILABILITY_OF_BASIC_SEED, SATISFACTION_ENFORCEMENT_SEED_LAW} from "../../reducers/StoreConstants";
import SatisfactionEnforcementSeedLawChart from "./SatisfactionEnforcementSeedLawChart";

const GaugesChart = ({data, mostRecentYears, sources, type, title, subTitle}) => {
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

    const getChart = () => {
        if (noData) {
            return <div className={"no-data"}>No data</div>;
        }
        switch (type) {
            case AVAILABILITY_OF_BASIC_SEED:
                return <AvailabilityOfBasicSeedChart data={data} yearsToShow={yearsToShow}/>;
            case SATISFACTION_ENFORCEMENT_SEED_LAW:
                return <SatisfactionEnforcementSeedLawChart data={data} yearsToShow={yearsToShow}/>;
            default:
                return null;
        }
    }

    return (<Grid className={"availability-of-basic-seed-container"}>
        <Grid.Row className="header-section with-bottom-border chart-title">
            <Grid.Column wide width={12}>
                <div className="titles">
                    <div className="title">{title}<span className="subtitle">{subTitle}</span>
                    </div>
                </div>
            </Grid.Column>
            <Grid.Column width={4}>
                <Export/>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row className={"with-bottom-border border-left border-right"}>
            <Heading legends={legends}/>
        </Grid.Row>
        <Grid.Row className={"with-bottom-border border-left border-right"}>
            {getChart()}
        </Grid.Row>
        <Grid.Row className={`source-section`}>
            <Grid.Column>
                <Source title={`Source: ${sources}`}/>
            </Grid.Column>
        </Grid.Row>
    </Grid>);
}
export default GaugesChart;
