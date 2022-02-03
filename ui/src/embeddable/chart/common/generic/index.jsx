import React from "react";
import './styles.scss';
import { injectIntl } from "react-intl";

const GenericLegend = ({ keys, title, colors, intl }) => {
  return <div style={{ width: '100%', display: 'flex' }}>
    <span className={"legend-title"}>{title}</span>
    <div className="keys">{keys.map((k, i) => {
      return (<div className="key" key={k}>
        <div className="circle" style={{ background: colors.get(k) }} />
        <span key={k}>{intl.formatMessage({id: k + '-tooltip', defaultMessage: k})}</span>
      </div>);
    })}</div>
  </div>
};
export default injectIntl(GenericLegend);