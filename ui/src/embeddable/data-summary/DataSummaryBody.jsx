import React, { useEffect, useState } from "react";
import { Accordion, Container, Icon } from "semantic-ui-react";
import { COUNTRY_SETTINGS, SUMMARY_INDICATORS } from "../reducers/StoreConstants";
import { getIndicators } from "../reducers/data";
import { connect } from "react-redux";

const DataSummaryBody = ({ summary_indicators }) => {
  const [activeIndex, setActiveIndex] = useState([0]);
  const [activeIndexIndicator, setActiveIndexIndicator] = useState(new Map());
  const [activeIndictomyMap, setMyMap] = useState();

  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex);
  }

  console.log(summary_indicators);

  const getIndicatorAccordion = (indicator) => {
    return (
      <Accordion>
        {indicator.map((i, index) => {
          return (<>
            <Accordion.Title
              active={activeIndex === index}
              index={index}
              onClick={handleClick}
            >
              <div className="indicator-theme">
                <Icon name='dropdown' />
                {i.name}
              </div>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === index}>
            </Accordion.Content>
          </>)
        })}
      </Accordion>);
  }

  function getIndicator() {
    return (
      summary_indicators && summary_indicators.map((i, index) => {
        return <>
          <Accordion.Title
            active={activeIndex === index}
            index={index}
            onClick={handleClick}
          >
            <div className="indicator-theme">
              <Icon name='dropdown' />
              {i.name}
            </div>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === index}>
            {getIndicatorAccordion(i.indicators)}
          </Accordion.Content>
        </>
      })

    )
      ;
  }

  return <Container className="summary-container"><Accordion styled>
    {getIndicator()}
  </Accordion></Container>
}

const mapStateToProps = (state, ownProps) => {
  return {
    country_settings: state.getIn(['data', COUNTRY_SETTINGS, 'data']),
    summary_indicators: state.getIn(['data', SUMMARY_INDICATORS])
  }
}

const mapActionCreators = {};
export default connect(mapStateToProps, mapActionCreators)(DataSummaryBody)
;