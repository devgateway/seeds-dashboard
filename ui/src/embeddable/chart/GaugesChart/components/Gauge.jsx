import React from "react";
import PropTypes from "prop-types";
import {Pie} from "@nivo/pie";
// make sure parent container have a defined height when using responsive component,
// otherwise height will be 0 and no chart will be rendered.
// website examples showcase many properties, you'll often use just a few of them.

const colors = new Map(
    [
        ["EP", "#f6d9d9"],
        ["EP_S", "#c00000"],
        ["P", "#f9e8e8"],
        ["P_S", "#d86565"],
        ["F", "#fff6d9"],
        ["F_S", "#ffc000"],
        ["G", "#e5f4da"],
        ["G_S", "#7dc646"],
        ["E", "#d4e1cc"],
        ["E_S", "#276700"]
    ]);
const getColor = (item) => colors.get(item.id);

const CenteredMetric = ({dataWithArc, centerX, centerY, innerValue, innerColor}) => {
    return (
        <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            dominantBaseline="central"
            font-weight="900"
            style={{
                fontSize: '22px',
                fill: innerColor
            }}
        > {innerValue}
        </text>
    )
}
const Gauge = ({data, height, width, innerValue, innerColor}) =>
    <div style={{height}}><Pie
        layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends',
            ({dataWithArc, centerX, centerY}) =>
                CenteredMetric({dataWithArc, centerX, centerY, innerValue, innerColor})]}
        width={width}
        colors={item => getColor(item)}
        height={height}
        data={data}
        startAngle={-90}
        endAngle={90}
        innerRadius={0.7}
        padAngle={2}
        cornerRadius={3}
        labelSkipWidth={18}
        slicesLabelsTextColor="#FFFFFF"
        enableRadialLabels={false}
        enableArcLinkLabels={false}
        enableArcLabels={false}
        slicesLabelsSkipAngle={10}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
    /></div>

export default Gauge;
