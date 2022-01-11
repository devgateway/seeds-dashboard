import React, {useState} from "react";
import {Grid} from "semantic-ui-react";
import {ResponsiveBar} from '@nivo/bar'
import Crops from "../common/crop";
import './styles.scss';
import Source from "../common/source";
import Filter from "../common/filter";
import Header from "../common/header";
import {getColor} from "../Countryinfo/CountryInfoChart";

const theme = {
    axis: {
        ticks: {
            text: {
                fontSize: 15,
                fill: "gray"
            },
            line: {
                stroke: "rgba(255,255,255,0)",
                strokeWidth: 0
            }
        },
        legend: {
            text: {
                fontSize: 15,
                fill: "black",
                fontWeight: 'bold'
            }
        }
    }
};

const VarietiesReleasedWithSpecialFeatures = ({data, sources}) => {

    const [selectedCrops, setSelectedCrops] = useState(null);
    const [initialCrops, setInitialCrops] = useState(null);
    const [currentData, setCurrentData] = useState(null);

    const processedData = [];

    if (!data || !data.dimensions || !data.dimensions.crop) {
        return null;
    }
    let crops = data.dimensions.crop.values;

    if (data !== currentData) {
        setCurrentData(data);
        setSelectedCrops(crops);
        setInitialCrops(crops);
    }

    // For initialization only.
    if (!initialCrops) {
        setSelectedCrops(crops);
        setInitialCrops(crops);
    } else {
        crops = selectedCrops;
    }

    crops.forEach(c => {
        let sumWF = 0;
        let sumWOF = 0;
        Object.keys(data.values[c]).forEach(i => {
            sumWF += data.values[c][i].withSpecialFeature || 0;
            sumWOF += data.values[c][i].withoutSpecialFeature || 0;
        });
        const header = {
            crop: c,
            withSpecialFeature: sumWF,
            withoutSpecialFeature: sumWOF,
            withSpecialFeatureColor: getColor({id: c.toLowerCase()}),
            withoutSpecialFeatureColor: getColor({id: c.toLowerCase()}),
        };
        processedData.push(header);
    });
    console.log(processedData);

    const handleCropFilterChange = (selected) => {
        const currentlySelected = [];
        for (let i = 0; i < selected.length; i++) {
            if (selected[i] === 1) {
                currentlySelected.push(initialCrops[i]);
            }
        }
        setSelectedCrops(currentlySelected);
    }

    return (
        <Grid className={`number-varieties-released`}>
            <Grid.Row className="header-section">
                <Grid.Column>
                    <Header title="Total Crops Released With and Without Special Features" subtitle=""/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`filters-section`}>
                <Grid.Column>
                    <Filter data={initialCrops} onChange={handleCropFilterChange}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`crops-with-icons`}>
                <Grid.Column width={8}>
                    <Crops data={selectedCrops} title="Crops" titleClass="crops-title"/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`chart-section`}>
                <Grid.Column width={16}>
                    <div style={{height: 450}}>
                        <ResponsiveBar
                            data={processedData}
                            keys={['withSpecialFeature', 'withoutSpecialFeature']}
                            indexBy="crop"
                            margin={{top: 50, right: 130, bottom: 50, left: 60}}
                            padding={0.3}
                            valueScale={{type: 'linear'}}
                            indexScale={{type: 'band', round: true}}
                            colors={{scheme: 'nivo'}}
                            defs={[
                                {
                                    id: 'dots',
                                    type: 'patternDots',
                                    background: 'inherit',
                                    color: '#38bcb2',
                                    size: 4,
                                    padding: 1,
                                    stagger: true
                                },
                                {
                                    id: 'lines',
                                    type: 'patternLines',
                                    background: 'inherit',
                                    color: '#eed312',
                                    rotation: -45,
                                    lineWidth: 6,
                                    spacing: 10
                                }
                            ]}
                            fill={[
                                {
                                    match: {
                                        id: 'withoutSpecialFeature'
                                    },
                                    id: 'lines'
                                }
                            ]}
                            borderColor={{from: 'color', modifiers: [['darker', 1.6]]}}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Crops',
                                legendPosition: 'middle',
                                legendOffset: 32
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Number of Varieties Released',
                                legendPosition: 'middle',
                                legendOffset: -40
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor={{from: 'color', modifiers: [['darker', 1.6]]}}
                            /*legends={[
                                {
                                    dataFrom: 'keys',
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 120,
                                    translateY: 0,
                                    itemsSpacing: 2,
                                    itemWidth: 100,
                                    itemHeight: 20,
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 0.85,
                                    symbolSize: 20,
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemOpacity: 1
                                            }
                                        }
                                    ]
                                }
                            ]}*/
                            role="application"
                            ariaLabel="Nivo bar chart demo"
                            barAriaLabel={function (e) {
                                return e.id + ": " + e.formattedValue + " in country: " + e.indexValue
                            }}
                        />
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`source-section`}>
                <Grid.Column>
                    <Source title={"Source: " + sources}/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default VarietiesReleasedWithSpecialFeatures
