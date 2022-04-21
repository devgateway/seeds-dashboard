import React from "react";
import PropTypes from "prop-types";
import {Pie} from "@nivo/pie";
// make sure parent container have a defined height when using responsive component,
// otherwise height will be 0 and no chart will be rendered.
// website examples showcase many properties, you'll often use just a few of them.

const colors = new Map(
    [
        ["EP", "#ffffff"],
        ["EP_S", "#FF3833"],
        ["P", "#ffffff"],
        ["P_S", "#FF7E37"],
        ["F", "#ffffff"],
        ["F_S", "#FFFC61"],
        ["G", "#ffffff"],
        ["G_S", "#CCF000"],
        ["E", "#ffffff"],
        ["E_S", "#75DD00"]
    ]);
const getColor = (item) => {
    console.log(item);
    return colors.get(item.id)
};

const borderColors = new Map(
    [
        ["EP", "#FF3833"],
        ["EP_S", "#FF3833"],
        ["P", "#FF7E37"],
        ["P_S", "#FF7E37"],
        ["F", "#FFFC61"],
        ["F_S", "#FFFC61"],
        ["G", "#CCF000"],
        ["G_S", "#CCF000"],
        ["E", "#75DD00"],
        ["E_S", "#75DD00"]
    ]);
const getBorderColor = (item) => borderColors.get(item.id);

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
        borderWidth={1.25}
        borderColor={item => getBorderColor(item)}
    /></div>

export default Gauge;
