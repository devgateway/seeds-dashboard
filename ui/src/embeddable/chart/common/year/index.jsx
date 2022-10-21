import React from "react";
import './styles.scss';

const YearLegend = ({years, colors, intl}) => {
    return <div style={{width: '100%', display: 'flex', paddingTop: '14px', paddingBottom: '14px'}}>
        <span className={"legend-title"}>{intl.formatMessage({id: "year-s"})}</span>
        <div className="years">{years.map((y, i) => {
            return (<div className="year" key={y}>
                <div className="circle" style={{background: colors[i]}}/>
                <span key={y}>{y}</span>
            </div>);
        })}</div>
    </div>
};
export default YearLegend;
