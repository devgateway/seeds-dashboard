import React, {useState} from 'react'
import {ResponsiveBar} from '@nivo/bar'
import {injectIntl} from 'react-intl';
import {BoxLegendSvg} from "@nivo/legends";
import {useTheme} from '@nivo/core'
import {colorSchemes,} from '@nivo/colors'

import {getTextWidth, lightenDarkenColor} from './utils.js'

import './chart.scss'

const Chart = ({legends, options, intl, format, colors, groupMode, height}) => {

    const [filter, setFilter] = useState([])
    const applyFilter = (values) => {
        if (filter) {
            if (colors.colorBy === 'index') {
                return values.filter(d => filter.indexOf(d[options.indexBy]) === -1);
            } else {
                return values.filter(d => filter.indexOf(d) === -1);
            }
        } else {
            return values
        }
    }

    const getColor = (id, d) => {
        if (colors.colorBy == 'keys') {
            if (id) {
                return getColorByKey(id)
            }
        } else {
            return getColorByIndex(d[options.indexBy])
        }
    }

    const getColorByPosition = (position) => {
        if (colors.scheme) {
            return colorSchemes[colors.scheme][position]
        } else {
            return colors.colors[position]
        }
    }

    const getColorByKey = (id) => {
        if (colors && colors.scheme) {
            const index = options.keys.findIndex(k => k == id)
            return getColorByPosition(index)
        } else {
            return colors.colors[options.keys.find(k => k == id)]
        }
    }

    const getLegendByKey = (id) => {
        return options.legends[options.keys.findIndex(k => k == id)]
    }

    const getTooltip = (options, d, value, id) => {
        if (options.apiKey == 'seedInspector') {
            return d.data.country + ": " + value + " " + getLegendByKey(id).toLowerCase()
        }
        if (options.apiKey == 'varietySold') {
            return "Number of varieties sold for " + getLegendByKey(id).toLowerCase() + ": " + value
        }
    }

    const getColorByIndex = (id) => {
        if (colors && colors.scheme) {
            const index = options.data.findIndex(f => f[options.indexBy] == id)
            return getColorByPosition(index)
        } else {
            return colors.colors[options.data.findIndex(f => f[options.indexBy] == id)]
        }
    }

    const BarLegend = ({height, legends, width}) => (
        <React.Fragment>
            {legends.map(legend => (
                <BoxLegendSvg
                    key={JSON.stringify(legend.data.map(({id}) => id))}
                    {...legend}
                    containerHeight={height}
                    containerWidth={width}
                />
            ))}
        </React.Fragment>
    );

    const CustomTick = tick => {
        const theme = useTheme()
        const width = getTextWidth(tick.value, 10) + 10
        return (<g transform={`translate(${tick.x},${tick.y + 22})`}>
            <rect x={(-1 * (width) / 2 + 3)} y={-6} rx={3} ry={3} width={(width) + 2} height={24}
                  fill="rgba(0, 0, 0, 0)"/>
            <rect x={-1 * (width) / 2} y={-12} rx={2} ry={2} width={width} height={24}
                  fill={colors.colorBy == 'keys' ? '#FFF' : getColorByIndex(tick.value)}/>
            
            <text
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                    ...theme.axis.ticks.text,
                    fill: '#000',
                    fontSize: 10,
                    fontWeight: 'bold'
                }}
            >
                {tick.value}
            </text>
        </g>)
    }


    const toggle = (id) => {

        const newFilter = filter.slice();
        if (newFilter.indexOf(id) > -1) {
            const index = newFilter.indexOf(id);
            newFilter.splice(index, 1);
        } else {
            newFilter.push(id)
        }
        setFilter(newFilter)
    }


    return (
        <div style={{height:height}}>
            {options && options.data && <ResponsiveBar
                colorBy={"index"}
                animate={true}
                enableLabel={true}
                motionStiffness={55}
                motionDamping={11}
                {...options}
                minValue="auto"
                keys={applyFilter(options.keys)}
                data={applyFilter(options.data)}
                groupMode={groupMode ? groupMode : "grouped"}
                enableGridX={options.enableGridX}
                enableGridY={options.enableGridY}
                margin={{top: 50, right: 10, bottom: 50, left: 150}}
                padding={0.35}
                colors={d => getColor(d.id, d.data)}
                borderColor="#000"
                axisTop={null}
                axisRight={null}
                axisBottom={{renderTick: CustomTick,}}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: legends.left,
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#ffffff"
                //label={(l) => intl.formatNumber(l.value / 100, format)}
                layers={["grid", "axes", "bars", "markers", BarLegend, 'annotations']}
                legends={[
                    {
                        data: colors.colorBy === 'index' ? options.data.map((d, index) => {
                            let theColor;
                            if (filter.indexOf(d[options.indexBy]) > -1) {
                                theColor = '#EEE'
                            } else {
                                theColor = getColor(d.id, d)
                            }
                            return {
                                color: theColor,
                                id: d[options.indexBy],
                                label: d[options.indexBy]
                            }
                        }) : options.keys.map((k) => {
                            let theColor;
                            if (filter.indexOf(k) > -1) {
                                theColor = '#EEE'
                            } else {
                                theColor = getColorByKey(k)
                            }
                            return {
                                color: theColor,
                                id: k,
                                label: getLegendByKey(k)
                            }
                        }),
                        anchor: 'top-right',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: -30,
                        itemsSpacing: 2,
                        itemWidth: options.itemWidth,
                        itemHeight: 30,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        onClick: (d) => {
                            toggle(d.id)
                        },
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: .6
                                }
                            }
                        ]
                    }
                ]}
                onMouseEnter={(_data, event) => {
                    event.target.style.fill = lightenDarkenColor(getColor(_data.id, _data.data), 30)
                }}
                onMouseLeave={(_data, event) => {
                    event.target.style.fill = getColor(_data.id, _data.data)
                }}
                animate={true}
                motionStiffness={130}
                motionDamping={15}
                tooltip={(d) => {
                    const {color, id, value} = d
                    return (
                        <strong style={{color}}>
                            {
                                getTooltip(options, d, value, id)
                                //d.data.country + ": " + value + " " + getLegendByKey(id)
                            //colors.colorBy == 'index' ? d.data[options.indexBy] : id}: {intl.formatNumber(value / 100, format)
                            }
                        </strong>
                    )
                }}
                theme={{
                    tooltip: {
                        container: {
                            background: '#fff',
                        },
                    },
                }}
            />}
        </div>
    )
}

export default injectIntl(Chart)
