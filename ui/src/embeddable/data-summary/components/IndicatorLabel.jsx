import React from "react";
import { Grid, Popup } from "semantic-ui-react";
import './IndicatorLabel.scss';
import { injectIntl } from "react-intl";
import { LEGEND } from "../Constants";

const IndicatorLabel = ({ field, className, range, displayType, intl }) => {
  if (field) {
    const style = {}
    let r;
    if (range) {
      const value = parseInt(field.value);
      r = range.find(r => value >= r.min && value < r.max);
      if (r) {
        style['background-color'] = r.color;
        style['color'] = '#FFFFFF';
      }
    }
    return <Grid
      className={className}>
      <Grid.Column width={10} className="label">{field.label}</Grid.Column>
      <Grid.Column width={6} className="value" style={style}>
        {r && <Popup
          trigger={<div>{formatValue(field.value, displayType, intl)}</div>}
          className="indicator-popup"
          position="right center">
          <Legend val={r.legend} color={r.color} />
        </Popup>}
        {!r && formatValue(field.value, displayType, intl)}
      </Grid.Column>
    </Grid>
  } else {
    return null
  }
}

const formatValue = (value, displayType, intl) => {
  const style = 'decimal';
  let decimals = 1;

  const format = { style, minimumFractionDigits: decimals, maximumFractionDigits: decimals }
  let formattedValue = value;
  if (displayType !== LEGEND && !isNaN(value)) {
    if (displayType === "Percentage") {
      formattedValue = `${intl.formatNumber(value * 100, format)} %`;
    } else {
      formattedValue = `${intl.formatNumber(value, format)} `;
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
export default injectIntl(IndicatorLabel);