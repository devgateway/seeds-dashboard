import React from "react";
import {Grid} from "semantic-ui-react";
import Line from "../Line";
import {ResponsiveLine} from "@nivo/line";

const NumberOfVarietiesReleased = ({data}) => {
    //const data2 = {};
    //data2.maxValue = 500;
    const data2 = [
        {
            "id": "japan",
            "color": "hsl(304, 70%, 50%)",
            "data": [
                {
                    "x": "plane",
                    "y": 296
                },
                {
                    "x": "helicopter",
                    "y": 182
                },
                {
                    "x": "boat",
                    "y": 68
                },
                {
                    "x": "train",
                    "y": 206
                },
                {
                    "x": "subway",
                    "y": 82
                },
                {
                    "x": "bus",
                    "y": 100
                },
                {
                    "x": "car",
                    "y": 261
                },
                {
                    "x": "moto",
                    "y": 193
                },
                {
                    "x": "bicycle",
                    "y": 177
                },
                {
                    "x": "horse",
                    "y": 173
                },
                {
                    "x": "skateboard",
                    "y": 177
                },
                {
                    "x": "others",
                    "y": 267
                }
            ]
        },
        {
            "id": "france",
            "color": "hsl(295, 70%, 50%)",
            "data": [
                {
                    "x": "plane",
                    "y": 111
                },
                {
                    "x": "helicopter",
                    "y": 208
                },
                {
                    "x": "boat",
                    "y": 275
                },
                {
                    "x": "train",
                    "y": 219
                },
                {
                    "x": "subway",
                    "y": 268
                },
                {
                    "x": "bus",
                    "y": 222
                },
                {
                    "x": "car",
                    "y": 88
                },
                {
                    "x": "moto",
                    "y": 179
                },
                {
                    "x": "bicycle",
                    "y": 105
                },
                {
                    "x": "horse",
                    "y": 237
                },
                {
                    "x": "skateboard",
                    "y": 82
                },
                {
                    "x": "others",
                    "y": 69
                }
            ]
        },
        {
            "id": "us",
            "color": "hsl(229, 70%, 50%)",
            "data": [
                {
                    "x": "plane",
                    "y": 266
                },
                {
                    "x": "helicopter",
                    "y": 255
                },
                {
                    "x": "boat",
                    "y": 59
                },
                {
                    "x": "train",
                    "y": 149
                },
                {
                    "x": "subway",
                    "y": 297
                },
                {
                    "x": "bus",
                    "y": 96
                },
                {
                    "x": "car",
                    "y": 176
                },
                {
                    "x": "moto",
                    "y": 261
                },
                {
                    "x": "bicycle",
                    "y": 166
                },
                {
                    "x": "horse",
                    "y": 208
                },
                {
                    "x": "skateboard",
                    "y": 259
                },
                {
                    "x": "others",
                    "y": 70
                }
            ]
        },
        {
            "id": "germany",
            "color": "hsl(230, 70%, 50%)",
            "data": [
                {
                    "x": "plane",
                    "y": 51
                },
                {
                    "x": "helicopter",
                    "y": 21
                },
                {
                    "x": "boat",
                    "y": 217
                },
                {
                    "x": "train",
                    "y": 175
                },
                {
                    "x": "subway",
                    "y": 173
                },
                {
                    "x": "bus",
                    "y": 113
                },
                {
                    "x": "car",
                    "y": 197
                },
                {
                    "x": "moto",
                    "y": 88
                },
                {
                    "x": "bicycle",
                    "y": 273
                },
                {
                    "x": "horse",
                    "y": 128
                },
                {
                    "x": "skateboard",
                    "y": 248
                },
                {
                    "x": "others",
                    "y": 151
                }
            ]
        },
        {
            "id": "norway",
            "color": "hsl(358, 70%, 50%)",
            "data": [
                {
                    "x": "plane",
                    "y": 16
                },
                {
                    "x": "helicopter",
                    "y": 264
                },
                {
                    "x": "boat",
                    "y": 115
                },
                {
                    "x": "train",
                    "y": 198
                },
                {
                    "x": "subway",
                    "y": 241
                },
                {
                    "x": "bus",
                    "y": 253
                },
                {
                    "x": "car",
                    "y": 153
                },
                {
                    "x": "moto",
                    "y": 232
                },
                {
                    "x": "bicycle",
                    "y": 47
                },
                {
                    "x": "horse",
                    "y": 257
                },
                {
                    "x": "skateboard",
                    "y": 270
                },
                {
                    "x": "others",
                    "y": 284
                }
            ]
        }
    ];
    return (
        <Grid className={`number-varieties-released`}>
            <Grid.Row className={`crops-with-icons`}>
                <Grid.Column width={16}>
                    <div className="label">Crops -- TODO: insert crop icons with a new component</div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`section`}>
                <Grid.Column width={16}>
                    <div style={{height: 350}}>
                        {/*<Line options={data2} legends={{}}/>*/}
                        <ResponsiveLine
                            data={data2}
                            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                            xScale={{ type: 'point' }}
                            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                            yFormat=" >-.2f"
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                orient: 'bottom',
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'transportation',
                                legendOffset: 36,
                                legendPosition: 'middle'
                            }}
                            axisLeft={{
                                orient: 'left',
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'count',
                                legendOffset: -40,
                                legendPosition: 'middle'
                            }}
                            pointSize={10}
                            pointColor={{ theme: 'background' }}
                            pointBorderWidth={2}
                            pointBorderColor={{ from: 'serieColor' }}
                            pointLabelYOffset={-12}
                            useMesh={true}
                            legends={[
                                {
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 100,
                                    translateY: 0,
                                    itemsSpacing: 0,
                                    itemDirection: 'left-to-right',
                                    itemWidth: 80,
                                    itemHeight: 20,
                                    itemOpacity: 0.75,
                                    symbolSize: 12,
                                    symbolShape: 'circle',
                                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemBackground: 'rgba(0, 0, 0, .03)',
                                                itemOpacity: 1
                                            }
                                        }
                                    ]
                                }
                            ]}
                        />
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default NumberOfVarietiesReleased
