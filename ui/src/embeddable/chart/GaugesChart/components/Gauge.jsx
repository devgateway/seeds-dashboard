import React from "react";
import PropTypes from "prop-types";
import {Pie} from "@nivo/pie";
// make sure parent container have a defined height when using responsive component,
// otherwise height will be 0 and no chart will be rendered.
// website examples showcase many properties, you'll often use just a few of them.

const colors = new Map(
    [
        ["EP", "#f5e4e4"],
        ["EP_S", "#c00000"],
        ["P", "#f5e9e9"],
        ["P_S", "#d86565"],
        ["F", "#f6f1e0"],
        ["F_S", "#ffc000"],
        ["G", "#eef8e6"],
        ["G_S", "#7dc646"],
        ["E", "#e7f1e1"],
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
            fontWeight="900"
            style={{
                fontSize: '22px',
                fill: innerColor
            }}
        > {innerValue}
        </text>
    )
}
const Gauge = ({data, height, width, innerValue, innerColor, tooltip}) =>
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
        padAngle={4}
        cornerRadius={1}
        labelSkipWidth={18}
        slicesLabelsTextColor="#FFFFFF"
        enableRadialLabels={false}
        enableArcLinkLabels={false}
        enableArcLabels={false}
        slicesLabelsSkipAngle={10}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        tooltip={tooltip}
        borderWidth={1.5}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.9
                ]
            ]
        }}
    /></div>

export default Gauge;
