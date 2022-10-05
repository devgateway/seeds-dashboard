import React, {useState} from 'react'
import {ResponsiveChoropleth} from '@nivo/geo'
import {injectIntl} from 'react-intl';
import countries from "../../../static/africa_countries.json";
import './styles.scss';

const getTooltipLegendByValue = (value, intl) => {
    let tooltipLegend = ""
    let className = "label1"
    if (value <= 19.99) {
        tooltipLegend = intl.formatMessage({id: 'extremelyPoor', defaultMessage: 'Extremely poor'});
    } else if (value <= 39.99) {
        tooltipLegend = intl.formatMessage({id: 'poor', defaultMessage: 'Poor'});
    } else if (value <= 59.99) {
        tooltipLegend = intl.formatMessage({id: 'fair', defaultMessage: 'Fair'});
    } else if (value <= 79.99) {
        tooltipLegend = intl.formatMessage({id: 'good', defaultMessage: 'Good'});
    } else {
        tooltipLegend = intl.formatMessage({id: 'excellent', defaultMessage: 'Excellent'});
    }
    return (<span className={className}>({tooltipLegend})</span>);
}

export const MapComponent = ({height, data, intl, colors}) => {
    return (<div className="map-wrapper" style={{height: height + 'px'}}>
        {data && <ResponsiveChoropleth
            data={data}
            features={countries.features}
            margin={{top: 0, right: 0, bottom: 0, left: 0}}
            colors={colors}
            label="properties.name"
            domain={[0, 100]}
            unknownColor="#D1D2D4"
            //valueFormat=".2s"
            projectionScale={350}
            projectionTranslation={[0.43, 0.51]}
            projectionRotation={[0, 0, 0]}
            enableGraticule={false}
            borderWidth={0.5}
            borderColor="#fff"
            isInteractive={true}
            tooltip={(e) => {
                if (e.feature.data) {
                    return (<div className="tooltip-wrapper">
                        <div className="tooltip-header">
                            <span className="label">{e.feature.data.country} -</span>
                            <span className="value">{e.feature.data.year}</span>
                        </div>
                        <div className="map-tooltip-data">
                            <span className="value">{e.feature.data.crop}</span>
                            <span className="label1">Opinion rating: </span>
                            <span className="labelBolder">{e.feature.data.value} </span>
                            {getTooltipLegendByValue(e.feature.data.value, intl)}
                        </div>
                    </div>)
                } else {
                    return (<div/>)
                }
            }}
            theme={{
                background: "#F3F9FF",
            }}
        />}
    </div>)
}

export default injectIntl(MapComponent)
