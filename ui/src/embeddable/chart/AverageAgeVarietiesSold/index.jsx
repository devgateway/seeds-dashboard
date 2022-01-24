import React, {useState} from "react";
import {Grid} from "semantic-ui-react";
import {ResponsiveBar} from '@nivo/bar'
import CropsLegend from "../common/crop";
import './styles.scss';
import Source from "../common/source";
import CropFilter from "../common/filters/crops";
import Header from "../common/header";
import {getColor} from "../Countryinfo/CountryInfoChart";
import Years from "../common/filters/years";
import CropsWithSpecialFeatures from "../common/cropWithSpecialFeatures";

const theme = {
    axis: {
        ticks: {
            text: {
                fontSize: 12,
                /*fontWeight: 'bold',*/
                fill: "#adafb2",
                textTransform: 'capitalize'
            },
            line: {
                stroke: "rgba(255,255,255,0)",
                strokeWidth: 0
            }
        },
        legend: {
            text: {
                fontSize: 12,
                fill: "black",
                fontWeight: 'bold',
                /*fontFamily: 'Lato'*/
            }
        }
    }
};

const blueColors = [
    '#3377b6', '#83b2de', '#9abfe1', '#c2dbf3'
];

const AverageAgeVarietiesSold = ({data, sources}) => {

    const [selectedCrops, setSelectedCrops] = useState(null);
    const [initialCrops, setInitialCrops] = useState(null);
    const [currentData, setCurrentData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    const processedData = [];
    let noData = false;
    let crops = null;
    let years = null;
    const colors = [];
    const keys = [];
    let max = 0;

    if (!data || !data.dimensions || !data.dimensions.crop || data.id === null) {
        noData = true;
    } else {
        crops = data.dimensions.crop.values;
        years = data.dimensions.year.values;

        if (data !== currentData) {
            setCurrentData(data);
            setSelectedCrops(crops);
            setInitialCrops(crops);
            setSelectedYear(years[years.length - 1])

            // workaround for selectedCrops not being updated.
            return null;
        }

        // For initialization only.
        if (!initialCrops) {
            setSelectedCrops(crops);
            setInitialCrops(crops);
        } else {
            crops = selectedCrops;
        }

        crops.forEach(c => {
            const entry = {crop: c};
            Object.keys(data.values[c]).forEach((i, j) => {
                const key = '' + i;
                entry[key] = data.values[c][i];
                if (!keys.find(i => i === key)) {
                    keys.push(key);
                }
                colors.push(blueColors[j]);

                if (Number(entry[i]) > max) {
                    max = Number(entry[i]);
                }
            });
            processedData.push(entry);
        });
    }

    const handleYearFilterChange = (selected) => {
        setSelectedYear(selected);
    }

    const handleCropFilterChange = (selected) => {
        const currentlySelected = [];
        for (let i = 0; i < selected.length; i++) {
            if (selected[i] === 1) {
                currentlySelected.push(initialCrops[i]);
            }
        }
        setSelectedCrops(currentlySelected);
    }
    const indexBy = "crop";

    // returns a list of total value labels for stacked bars
    const TotalLabels = ({bars, yScale}) => {
        // space between top of stacked bars and total label
        const labelMargin = 30;

        const numbers = [];
        bars.forEach(({data: {data, indexValue, id}, x, width}, i) => {
            const transform = `translate(${x}, ${yScale(data[id]) - labelMargin})`;
            if (!numbers.find(i => i.props.transform === transform)) {
                numbers.push(<g
                    transform={transform}
                    key={`${indexValue}-${i}`}>
                    <text
                        // add any class to the label here
                        className="bar-total-label"
                        x={width / 2}
                        y={labelMargin / 2}
                        textAnchor="middle"
                        alignmentBaseline="central"
                        // add any style to the label here
                        style={{
                            fontWeight: 'bold',
                            fontSize: '14pt'
                        }}>
                        {data[id]}
                    </text>
                </g>);
            }
        });
        return numbers;
    };

    return (
        <Grid className={`average-age-varieties-sold`}>
            <Grid.Row className="header-section">
                <Grid.Column>
                    <Header title="Average Age of Varieties Sold" subtitle=""/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`filters-section`}>
                {!noData ? <Grid.Column computer={3} mobile={16}>
                    <CropFilter data={initialCrops} onChange={handleCropFilterChange}/>
                </Grid.Column> : null}
                {!noData ? <Grid.Column computer={3} mobile={16}>
                    <Years data={years} onChange={handleYearFilterChange}/>
                </Grid.Column> : null}
            </Grid.Row>
            <Grid.Row className={`chart-section`}>
                <Grid.Column width={16}>
                    <div style={{height: 450}}>
                        {!noData ? <ResponsiveBar
                            theme={theme}
                            groupMode="grouped"
                            layers={["grid", "axes", "bars", TotalLabels, "markers", "legends"]}
                            data={processedData}
                            keys={keys}
                            indexBy={indexBy}
                            margin={{top: 50, right: 60, bottom: 70, left: 70}}
                            padding={0.3}
                            innerPadding={8}
                            valueScale={{type: 'linear', max: 'auto'}}
                            indexScale={{type: 'band', round: true}}
                            colors={colors}
                            borderWidth={0}
                            borderRadius={0}
                            borderColor={{from: 'color', modifiers: [['darker', 0.4]]}}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 0,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Crops',
                                legendPosition: 'middle',
                                legendOffset: 45,
                            }}
                            axisLeft={{
                                tickSize: 0,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Average age (years) Years',
                                legendPosition: 'middle',
                                legendOffset: -60,
                                tickValues: 6
                            }}
                            gridYValues={6}
                            enableLabel={false}
                            legends={[
                                {
                                    dataFrom: 'keys',
                                    anchor: 'top-left',
                                    direction: 'row',
                                    justify: false,
                                    translateX: 120,
                                    translateY: -40,
                                    itemsSpacing: 2,
                                    itemWidth: 150,
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
                            ]}
                            tooltip={(d) => {
                                return (<div className="tooltip-container-aavs">
                                    <div className="header-container">
                                        <div className="header">
                                            <div className="inner-container">
                                                <div className={d.indexValue.toLowerCase() + " crop-icon"}/>
                                                <div className="crop-name">{d.indexValue}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="amount-container">
                                        <table width="100%">
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <span>Average Age </span>
                                                    <span className="bold">{d.data[d.id]}</span>
                                                    <br/>
                                                    <span>Year </span>
                                                    <span className="bold">{d.id}</span>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>)
                            }}
                        /> : <h2 className="no-data">No Data</h2>}
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

export default AverageAgeVarietiesSold
