import React, { useEffect, useRef, useState } from "react";
import { Container, Sticky } from "semantic-ui-react";
import { connect } from "react-redux";
import { COUNTRY_SETTINGS, DATA, SUMMARY_INDICATORS } from "../reducers/StoreConstants";
import './data-summary.scss';

import { getIndicators } from "../reducers/data";
import DataSummaryBody from "./DataSummaryBody";
import Filter from "../filter";
import { legends } from "./LegendsConstants";
import Heading from "./components/Heading";

const DataSummary = ({
                         onLoadIndicators, summary_indicators, editing,
                         'data-title': title = 'Data Summary: Country comparison',
                         'data-rating-label': rating = 'rating',
                         'data-number-label': number = 'number',
                         'data-rating-alignment': ratingAlignment = 'right',
                         'data-number-alignment': numberAlignment = 'right',
                         'data-rating-minimum-fraction-digits': ratingMinimumFractionDigits = 0,
                         'data-rating-maximum-fraction-digits': ratingMaximumFractionDigits = 1,
                         'data-number-minimum-fraction-digits': numberMinimumFractionDigits = 0,
                         'data-number-maximum-fraction-digits': numberMaximumFractionDigits = 1
                     }) => {
        const labels = {};
        labels.rating = rating;
        labels.number = number;
        const alignments = {};
        alignments.rating = ratingAlignment;
        alignments.number = numberAlignment;
        const numberFormat = {};
        numberFormat.rating = {
            minimumFractionDigits: ratingMinimumFractionDigits,
            maximumFractionDigits: ratingMaximumFractionDigits
        }
        numberFormat.number = {
            minimumFractionDigits: numberMinimumFractionDigits,
            maximumFractionDigits: numberMaximumFractionDigits
        }
        const configuration = { alignments, labels, numberFormat };
        useEffect(() => {
            onLoadIndicators()
        }, [summary_indicators, onLoadIndicators])
        const [isFilterOpen, setIsFilterOpen] = useState(false);
        const contextRef = useRef(null);
        return (<div ref={contextRef}>
            <Container className={"data-summary"}>
                <Heading legends={legends} title={title} showMDNALegends={true} />
            </Container>
            <Sticky context={contextRef}>
                <Filter setIsFilterOpen={setIsFilterOpen} />
            </Sticky>
            <Container fluid={true} className={"data-summary"}>
                <DataSummaryBody editing={editing === 'true'} overrideSticky={isFilterOpen} configuration={configuration} />
            </Container>
        </div>);
    }
;
const mapStateToProps = (state) => {
    return {
        country_settings: state.getIn([DATA, COUNTRY_SETTINGS, DATA]),
        summary_indicators: state.getIn([DATA, SUMMARY_INDICATORS, DATA])
    }
}

const mapActionCreators = {
    onLoadIndicators: getIndicators
};
export default connect(mapStateToProps, mapActionCreators)(DataSummary)
