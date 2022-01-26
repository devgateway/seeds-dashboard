import React, {useState} from "react";
import {Grid} from "semantic-ui-react";
import {ResponsiveBar} from '@nivo/bar'
import YearsLegend from "../common/year";
import './styles.scss';
import Source from "../common/source";
import CropFilter from "../common/filters/crops";
import Header from "../common/header";
import {getYearColors} from "../Countryinfo/CountryInfoChart";
import Years from "../common/filters/years";

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

const NumberVarietiesSold = ({data, sources}) => {

    const [selectedCrops, setSelectedCrops] = useState(null);
    const [selectedYears, setSelectedYears] = useState(null);
    const [initialCrops, setInitialCrops] = useState(null);
    const [initialYears, setInitialYears] = useState(null);
    const [currentData, setCurrentData] = useState(null);

    const processedData = [];

    if (!data || data.id === null) {
        return null;
    }
    let crops = data.dimensions.crop.values;
    let years = data.dimensions.year.values;

    if (data !== currentData) {
        setCurrentData(data);
        setSelectedCrops(crops);
        setSelectedYears(years);
        setInitialCrops(crops);
        setInitialYears(years);
    }

    // For initialization only.
    if (!initialCrops) {
        setSelectedCrops(crops);
        setSelectedYears(years);
        setInitialCrops(crops);
        setInitialYears(years);
    } else {
        crops = selectedCrops;
    }

    crops.forEach(c => {
        const header = data.values[c];
        header.id = c;
        processedData.push(header);
    });

    const colors = getYearColors(selectedYears);


    const handleCropFilterChange = (selected) => {
        const currentlySelected = [];
        for (let i = 0; i < selected.length; i++) {
            if (selected[i] === 1) {
                currentlySelected.push(initialCrops[i]);
            }
        }
        setSelectedCrops(currentlySelected);
    }

    const handleYearFilterChange = (selected) => {
        const currentlySelected = [];
        for (let i = 0; i < selected.length; i++) {
            if (selected[i] === 1) {
                currentlySelected.push(initialYears[i]);
            }
        }
        setSelectedYears(currentlySelected);
    }

    const commonProps = {
        margin: { top: 60, right: 80, bottom: 60, left: 80 },
        data: processedData,
        indexBy: "id",
        keys: selectedYears,
        padding: 0.2,
        labelTextColor: "inherit:darker(1.4)",
        labelSkipWidth: 16,
        labelSkipHeight: 16,
        groupMode:"grouped"
    };

    const indexBy = "id";

    const TotalLabels = ({bars, yScale}) => {
        // space between top of stacked bars and total label
        const labelMargin = 20;
        const numbers = [];
        bars.forEach(({data: {value, indexValue}, x, width}, i) => {

            const transform = `translate(${x}, ${yScale(value) - labelMargin})`;
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
                        {value}
                    </text>
                </g>);
            }
        });
        return numbers;
    };

    return (
        <Grid className={`number-varieties-released`}>
            <Grid.Row className="header-section">
                <Grid.Column>
                    <Header title="Number of varieties sold"/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`filters-section`}>
                <Grid.Column>
                    <CropFilter data={initialCrops} onChange={handleCropFilterChange}/>
                </Grid.Column>
                <Grid.Column>
                    <Years data={years} onChange={handleYearFilterChange} isMulti={true}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`crops-with-icons`}>
                <Grid.Column width={8}>
                    <YearsLegend data={selectedYears} title="Years" titleClass="years-title"/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`chart-section`}>
                <Grid.Column width={16}>
                    <div style={{height: 450}}>


                        <ResponsiveBar
                            theme={theme}
                            layers={["grid", "axes", "bars", TotalLabels, "markers", "legends"]}
                            data={processedData}
                            keys={selectedYears}
                            indexBy={"id"}
                            margin={{top: 50, right: 60, bottom: 70, left: 70}}
                            padding={0.3}
                            colors={colors}
                            groupMode="grouped"
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
                                legend: 'Number of varieties sold',
                                legendPosition: 'middle',
                                legendOffset: -60,
                                tickValues: 6
                            }}
                            gridYValues={6}
                            enableLabel={false}
                            tooltip={(d) => {
                                return (<div className="tooltip-container">
                                    <div className="header-container">
                                        <div className="header">
                                            <div className="inner-container">
                                                <div className={d.indexValue.toLowerCase() + " crop-icon"}/>
                                                <div className="crop-name">{d.indexValue}</div>
                                            </div>
                                            <div className="table">
                                                <label style={{float: 'left'}} className="year">Year</label>
                                                <label style={{float: 'right'}} className="vr">Varieties Sold</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="amount-container">
                                        <table width="100%">
                                            <tr>
                                                <td className="year">{d.id}</td>
                                                <td style={{fontWeight: 'bold'}}>{d.value}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>)
                            }}
                            /*sliceTooltip={}*/
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

export default NumberVarietiesSold
