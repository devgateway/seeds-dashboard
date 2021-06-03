import React from 'react'
import { ResponsiveRadar } from '@nivo/radar'
import {injectIntl} from 'react-intl';

import './chart.scss'

const Chart = ({height, options, intl}) => {
    return (
        <div style={{height:height}}>
            
            {options && options.data && <ResponsiveRadar
        data={options.data}
        keys={options.keys}
        indexBy="subindicator"
        maxValue="100"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        curve="linearClosed"
        borderWidth={2}
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
        colors={{ scheme: 'category10' }}
        fillOpacity={0}
        blendMode="multiply"
        animate={true}
        motionConfig="wobbly"
        isInteractive={true}
        gridLabel={LabelComponent}
        legends={[
            {
                anchor: 'top-right',
                direction: 'row',
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999',
                symbolSize: 12,
                symbolShape: 'square',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />}
        
        </div>
    )
}

const LabelComponent = ({ id, anchor }) => (
    <g transform={`translate(${anchor === 'end' ? -130 : anchor === 'middle' ? -50 : -20}, ${anchor === 'middle' ? 20: -10})`}>
        <text className="radar-label">{id}</text>
        
    </g>
)



export default injectIntl(Chart)
