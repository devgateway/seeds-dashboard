import React from "react";
import { Grid, Placeholder, Popup } from "semantic-ui-react";
import './IndicatorLabel.scss';
import { injectIntl } from "react-intl";
import { LEGEND } from "../Constants";
import { COUNTRY_SETTINGS, SUMMARY_INDICATORS, SUMMARY_INDICATORS_INFORMATION } from "../../reducers/StoreConstants";
import { getIndicatorsInformation } from "../../reducers/data";
import { connect } from "react-redux";

const MIN_WIDTH = 1000;

const IndicatorLabel = ({ field, className, range, displayType, intl, selectedCountry, loading }) => {
  if (field) {
    const style = {}
    let r;
    if (range) {
      const value = parseInt(field.value);
      r = range.find(r => value >= r.min && value <= r.max);
      if (r) {
        style['background-color'] = r.color;
        style['color'] = '#FFFFFF';
      }
    }
    if (window.innerWidth <= MIN_WIDTH) {
      style['fontSize'] = '11px';
    }
    const getGridColumns = () => {
      if (!field.label && isNaN(field.value) && displayType !== LEGEND) {
        return <div className={isNaN(field.value) ? ' letter centered' : ''}>{field.value}</div>;
      } else {
        return <>
          <Grid.Column style={window.innerWidth <= MIN_WIDTH ? {fontSize: '11px'} : {}}
                       width={selectedCountry ? 9 : 10}
                       className="label">{field.label}</Grid.Column>
          <Grid.Column width={selectedCountry ? 7 : 6} className="value" style={style}>
            {r && <Popup
                trigger={<div
                    className={isNaN(field.value) ? ' letter' : ''}>{formatValue(field.value, displayType, intl)}</div>}
                className="indicator-popup"
                position="right center">
              <Legend val={r.legend} color={r.color}/>
            </Popup>}
            {!r &&
            <div className={isNaN(field.value) ? ' letter' : ''}>{formatValue(field.value, displayType, intl)}</div>}
          </Grid.Column>
        </>
      }
    }

    return <Grid
      className={className}>
      {getGridColumns()}
    </Grid>
  } else {
    let empty = <div className="empty"/>;
    if (loading) {
      empty = <Placeholder>
        <Placeholder.Line length='full' /></Placeholder>
    }
    return empty;
  }
}

const formatValue = (value, displayType, intl) => {
  let formattedValue = value;
  if (value != 'number' && value != 'rating') {
    const style = 'decimal';
    let decimals = value.indexOf('.') > 0 ? 1 : 0;
    const format = {style, minimumFractionDigits: decimals, maximumFractionDigits: decimals}
    if (displayType !== LEGEND && !isNaN(value)) {
      if (displayType === "Percentage") {
        formattedValue = `${intl.formatNumber(value * 100, format)} %`;
      } else {
        formattedValue = `${intl.formatNumber(value, format)} `;
      }
    }
  }
  return formattedValue;
}
const Legend = ({ val, color }) => {
  const regexText = /[a-zA-Z\s]+/g;
  const number = /\(([^)]+)\)/g;
  return (<><span style={{
      color,
      fontWeight: 'bold'
    }}>{val.match(regexText)}</span><span><span style={{ color: 'grey' }}>{val.match(number)}</span></span>&nbsp;</>
  )
}

const mapStateToProps = (state) => {
  return {
    loading: state.getIn(['data', SUMMARY_INDICATORS_INFORMATION, 'LOADING'])
  }
}

const mapActionCreators = {};
export default connect(mapStateToProps, mapActionCreators)(injectIntl(IndicatorLabel));
