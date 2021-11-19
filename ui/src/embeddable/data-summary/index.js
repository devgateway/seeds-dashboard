import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import { connect } from "react-redux";
import { COUNTRY_SETTINGS, SUMMARY_INDICATORS } from "../reducers/StoreConstants";
import './data-summary.scss';
import Heading from "./Heading";
import { getIndicators } from "../reducers/data";

const DataSummary = ({ 'data-type': type, onLoadIndicators, summary_indicators }) => {
  useEffect(() => {
    onLoadIndicators()
  }, [summary_indicators])

  if (type === 'heading') {
    return <Container fluid={true} className={"data-summary"}
    ><Heading /></Container>;
  }
  {
    return <div>body</div>;
  }


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