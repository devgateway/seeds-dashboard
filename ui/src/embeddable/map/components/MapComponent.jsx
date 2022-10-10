import React, {useState} from 'react'
import {ResponsiveChoropleth} from '@nivo/geo'
import countries from "../../../static/africa_countries.json";
import './styles.scss';

const getTooltipLegendByValue = (value, intl, scale) => {
    let className = "label1"
    let tooltipLegend = '';
    if (scale(value)['label-key']) {
        tooltipLegend = intl.formatMessage({id: scale(value)['label-key'], defaultMessage: scale(value).label});
        return (<span style={{/*color: scale(value).color*/}}>({tooltipLegend})</span>);
    }
    return (<span className={className} style={{/*color: scale(value).color*/}} />);
}

const getColorByValue = (value, scale) => {
    return scale(value).color;
}

export const MapComponent = ({height, data, intl, colors, dontUseCrops, domain, scale, numberSuffix, legend = 'opinionRating'}) => {
    return (<div className="map-wrapper" style={{height: height + 'px'}}>
        {data && <ResponsiveChoropleth
            data={data}
            features={countries.features}
            margin={{top: 0, right: 0, bottom: 0, left: 0}}
            colors={colors}
            label="properties.name"
            domain={domain}
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
                    let header;
                    if (!dontUseCrops) {
                        header = (<div className="label">
                                    <div className={e.feature.data.crop + " crop-icon"}>
                                        <span>{intl.formatMessage({ id: e.feature.data.crop})} - {e.feature.data.country} <b>{e.feature.data.year}</b></span>
                                    </div>
                                </div>);
                    } else {
                        header = (<div className="label">
                                    <div className="crop-icon">
                                        <span>{e.feature.data.country} <b>{e.feature.data.year}</b></span>
                                    </div>
                                </div>);
                    }
                    return (<div className="tooltip-wrapper">
                        <div className="tooltip-header">
                            {header}
                        </div>
                        <div className="map-tooltip-data">
                            <span className="label1">{intl.formatMessage({ id: legend })}: </span>
                            <span className="labelBolder" style={{/*color: getColorByValue(e.feature.data.value, scale)*/}}>
                                {e.feature.data.value}{numberSuffix} {getTooltipLegendByValue(e.feature.data.value, intl, scale)}
                            </span>
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

export default MapComponent
