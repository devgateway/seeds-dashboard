import React, { useEffect, useRef } from "react";
import { Container, Sticky } from "semantic-ui-react";
import { connect } from "react-redux";
import { COUNTRY_SETTINGS, DATA, SUMMARY_INDICATORS } from "../reducers/StoreConstants";
import './data-summary.scss';
import Heading from "./Heading";
import { getIndicators } from "../reducers/data";
import DataSummaryBody from "./DataSummaryBody";
import Filter from "../filter";

const DataSummary = ({ onLoadIndicators, summary_indicators }) => {
  useEffect(() => {
    onLoadIndicators()
  }, [summary_indicators, onLoadIndicators])
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
};
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