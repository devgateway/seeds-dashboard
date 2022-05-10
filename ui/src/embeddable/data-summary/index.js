import React, {useEffect, useRef, useState} from "react";
import { Container, Sticky } from "semantic-ui-react";
import { connect } from "react-redux";
import { COUNTRY_SETTINGS, DATA, SUMMARY_INDICATORS } from "../reducers/StoreConstants";
import './data-summary.scss';

import { getIndicators } from "../reducers/data";
import DataSummaryBody from "./DataSummaryBody";
import Filter from "../filter";
import { legends } from "./LegendsConstants";
import Heading from "./components/Heading";

const DataSummary = ({ onLoadIndicators, summary_indicators }) => {
  
  useEffect(() => {
    onLoadIndicators()
  }, [summary_indicators, onLoadIndicators]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const contextRef = useRef(null);
  return (<div ref={contextRef}>
    <Container className={"data-summary"}>
      <Heading legends={legends} title={"Data Summary: Country comparison"} showMDNALegends={true} />
    </Container>
    <Sticky context={contextRef}>
      <Filter setIsFilterOpen={setIsFilterOpen}/>
    </Sticky>
    <Container fluid={true} className={"data-summary"}>
      <DataSummaryBody overrideSticky={isFilterOpen}/>
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
