import React, { useEffect, useRef } from "react";
import { Container, Sticky } from "semantic-ui-react";
import { connect } from "react-redux";
import { COUNTRY_SETTINGS, SUMMARY_INDICATORS } from "../reducers/StoreConstants";
import './data-summary.scss';
import Heading from "./Heading";
import { getIndicators } from "../reducers/data";
import DataSummaryBody from "./DataSummaryBody";
import Filter from "../filter";

const DataSummary = ({ 'data-type': type, onLoadIndicators, summary_indicators }) => {
  useEffect(() => {
    onLoadIndicators()
  }, [summary_indicators])
  const contextRef = useRef(null);
  return (<div ref={contextRef}>
    <Container fluid={true} className={"data-summary"}>
      <Heading />
    </Container>
    <Sticky context={contextRef}>
      <Filter />
    </Sticky>
    <Container fluid={true} className={"data-summary"}>
      <DataSummaryBody />
    </Container>
  </div>);
}

const mapStateToProps = (state, ownProps) => {
  return {
    country_settings: state.getIn(['data', COUNTRY_SETTINGS, 'data']),
    summary_indicators: state.getIn(['data', SUMMARY_INDICATORS, 'data'])
  }
}

const mapActionCreators = {
  onLoadIndicators: getIndicators
};
export default connect(mapStateToProps, mapActionCreators)(DataSummary)