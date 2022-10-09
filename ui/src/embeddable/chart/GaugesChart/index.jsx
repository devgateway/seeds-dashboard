import React, { useRef, useState } from "react";
import AvailabilityOfBasicSeedChart from "./AvailabilityOfBasicSeedChart";
import { Grid } from "semantic-ui-react";
import Export from "../common/export";
import Source from "../common/source";
import Heading from "../../data-summary/components/Heading";
import { legends } from "./components/LegendConstant";
import {
    AVAILABILITY_OF_BASIC_SEED, COUNTRIES_FILTER,
    DATA, MAP_INDICATOR_DATA,
    SATISFACTION_ENFORCEMENT_SEED_LAW,
    WP_CATEGORIES
} from "../../reducers/StoreConstants";
import SatisfactionEnforcementSeedLawChart from "./SatisfactionEnforcementSeedLawChart";
import './styles.scss';
import Notes from "../common/source/Notes";
import { getCountries, getMapIndicator, getWpCategories, setFilter } from "../../reducers/data";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";

const GaugesChart = ({
                         data,
                         mostRecentYears,
                         sources,
                         type,
                         title,
                         subTitle,
                         methodology,
                         download,
                         exportPng,
                         tooltip,
                         categoriesWP
                     }) => {
    const ref = useRef(null);
    const [hasNotes, setHasNotes] = useState(false)
    let yearsToShow;
    let noData = false;
    let categoryType;
    if (categoriesWP) {
        categoryType = categoriesWP.find(c => c.slug === type.toLowerCase())
    }
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
                return <AvailabilityOfBasicSeedChart data={data} yearsToShow={yearsToShow} tooltip={tooltip} />;
            case SATISFACTION_ENFORCEMENT_SEED_LAW:
                return <SatisfactionEnforcementSeedLawChart data={data} yearsToShow={yearsToShow} tooltip={tooltip} />;
            default:
                return null;
        }
    }

    return (<div ref={ref}>
        <Grid className={"availability-of-basic-seed-container"}>
            <Grid.Row className="header-section with-bottom-border">
                <Grid.Column wide width={12}>
                    <div className="titles">
                        <div className="title">{title}<span className="subtitle">{subTitle}</span>
                        </div>
                    </div>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Export methodology={methodology} exportPng={exportPng} download={download} containerRef={ref}
                            type={'gauge'} chartType={type} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={"with-bottom-border border-left border-right"}>
                <Heading legends={legends} />
            </Grid.Row>
            <Grid.Row className={"with-bottom-border border-left border-right"}>
                {getChart()}
            </Grid.Row>
            <Grid.Row className={`source-section ${hasNotes ? ' no-bottom-border' : ''}`}>
                <Grid.Column>
                    <Source title={`Source: ${sources}`} />
                </Grid.Column>
            </Grid.Row>
            <Notes chardIdCategory={categoryType ? categoryType.id : undefined} setHasNotes={setHasNotes} />
        </Grid>
    </div>);
}
const mapStateToProps = (state, ownProps) => {
    return {
        categoriesWP: state.getIn([DATA, WP_CATEGORIES])
    }
}

const mapActionCreators = {};

export default connect(mapStateToProps, mapActionCreators)(injectIntl(GaugesChart))
