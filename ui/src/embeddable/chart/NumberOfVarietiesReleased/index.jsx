import React from "react";
import {Grid} from "semantic-ui-react";
import Line from "../Line";
import {ResponsiveLine} from "@nivo/line";
import Crops from "../crop";

const NumberOfVarietiesReleased = ({data}) => {
    const processedData = [];
    if (data) {
        const yearsInValues = Object.keys(data.values);
        const allYears = fillGaps(yearsInValues);
        const crops = data.dimensions.crop.values;
        crops.forEach(c => {
            const header = {
                id: c,
                data: []
            };
            yearsInValues.forEach(y => {
                if (data.values[y]) {
                    header.data.push({
                        x: y,
                        y: data.values[y][c]
                    });
                } else {
                    header.data.push({
                        x: y,
                        y: null
                    });
                }
            });
            processedData.push(header);
        });
    }

    return (
        <Grid className={`number-varieties-released`}>
            <Grid.Row className={`crops-with-icons`}>
                <Grid.Column width={8}>
                    <Crops data={data.dimensions.crop.values}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`section`}>
                <Grid.Column width={16}>
                    <div style={{height: 350}}>
                        {/*<Line options={data2} legends={{}}/>*/}
                        <ResponsiveLine
                            data={processedData}
                            margin={{top: 50, right: 110, bottom: 50, left: 60}}
                            xScale={{type: 'point'}}
                            yScale={{type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false}}
                            yFormat=" >-.2f"
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                orient: 'bottom',
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Year',
                                legendOffset: 36,
                                legendPosition: 'middle'
                            }}
                            axisLeft={{
                                orient: 'left',
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Number of varieties released',
                                legendOffset: -40,
                                legendPosition: 'middle'
                            }}
                            pointSize={10}
                            pointColor={{theme: 'background'}}
                            pointBorderWidth={2}
                            pointBorderColor={{from: 'serieColor'}}
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

function fillGaps(data) {
    const sorted = data.sort();
    const min = Number(sorted[0]);
    const max = Number(sorted[data.length - 1]);
    const all = [];
    for (let i = min; i <= max; i++) {
        all.push(i);
    }
    return all;
}

export default NumberOfVarietiesReleased
