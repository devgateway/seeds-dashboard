import React from 'react'
import { ThemeProvider, SvgWrapper } from "@nivo/core";
import { BoxLegendSvg } from "@nivo/legends";
import { ResponsiveRadar } from '@nivo/radar'
import { injectIntl } from 'react-intl';

import './chart.scss'

const Chart = ({ height, options, intl, colors }) => {
    return (
        <div style={{ height: height }} className="radar">
            {options && options.data && <>
                <ThemeProvider>
                    <div style={{ textAlign: 'right' }}>
                        <SvgWrapper
                            width={'172'}
                            height={40}
                            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        >
                            <BoxLegendSvg
                                anchor="right"
                                data={options.keys.map((id, index) => ({
                                    color: Object.values(colors)[index] ? Object.values(colors)[index] : '#000',
                                    id,
                                    label: id,
                                })).reverse()}
                                direction="row"
                                justify={false}
                                itemWidth={80}
                                itemHeight={20}
                                itemsSpacing={15}
                                itemTextColor={'#999'}
                                itemDirection={"left-to-right"}
                                padding={10}
                                translateX={-90}
                                translateY={-40}
                                symbolSize={12}
                                symbolShape="square"
                            />
                        </SvgWrapper>
                    </div>
                </ThemeProvider>
                <ResponsiveRadar
                    data={options.data}
                    keys={options.keys}
                    indexBy="subindicator"
                    maxValue="100"
                    margin={{ top: 60, right: 80, bottom: 80, left: 80 }}
                    curve="linearClosed"
                    borderWidth={2}
                    colors={d => getColor(d, colors)}
                    borderColor={{ from: 'color' }}
                    gridLevels={7}
                    gridShape="linear"
                    gridLabelOffset={36}
                    enableDots={true}
                    dotSize={1}
                    dotColor={{ theme: 'background' }}
                    dotBorderWidth={2}
                    dotBorderColor={{ from: 'color' }}
                    enableDotLabel={true}
                    dotLabel={d => d.value + "%"}
                    dotLabelYOffset={-12}
                    fillOpacity={0}
                    blendMode="multiply"
                    animate={true}
                    motionConfig="wobbly"
                    isInteractive={true}
                    gridLabel={LabelComponent}
                    tooltipFormat={d => d + "%"}
                    theme={{
                        tooltip: {
                            container: {
                                boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
                                padding: 0,
                            },
                        },
                    }}
                />
            </>}
        </div>
    )
}

const getColor = (d, colors) => {
    if (d && colors) {
        return Object.entries(colors).find(x => x[0] == d.key)[1]
    } else {
        return "#000000"
    }
}

const LabelComponent = ({ id, anchor }) => (
    <g transform={`translate(${anchor === 'end' ? -130 : anchor === 'middle' ? -50 : -20}, ${anchor === 'middle' ? 20 : -10})`}>
        <text className="radar-label">{id}</text>
    </g>
)

export default injectIntl(Chart)
