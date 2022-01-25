import React, {useState} from "react";
import {Grid} from "semantic-ui-react";
import {ResponsiveBar} from '@nivo/bar'
import {useTheme} from '@nivo/core'
import './styles.scss';
import Source from "../common/source";
import CropFilter from "../common/filters/crops";
import Header from "../common/header";
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
const getTextWidth = (text, font) => {
    // re-use canvas object for better performance
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

const blueColors = [
    '#3377b6', '#7dafde', '#9fbfdc', '#c2dbf3'
];

const FAKE_NUMBER = 0.001;

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
                entry[key] = Number(data.values[c][i]) >= 0 ? data.values[c][i] : FAKE_NUMBER;
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
        const data_ = data;
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
                        {data[id] !== FAKE_NUMBER ? data[id] : data_.values[data.crop][id]}
                    </text>
                </g>);
            }
        });
        return numbers;
    };

    const generateLegends = () => {
        return (<div style={{width: '100%', display: 'flex'}}>
            <span className={"legend-title"}>Year(s)</span>
            <div className="years">{years.map((y, i) => {
                return (<div className="year" key={y}>
                    <div className="circle" style={{background: blueColors[i]}}/>
                    <span key={y}>{y}</span>
                </div>);
            })}</div>
        </div>);
    }

    const CustomTick = tick => {
        const tickRotation = 0;
        const theme = useTheme()
        const tickConfig = {
            color: '#FFFFFF',
            fontColor: '#000000',
            fontSize: 10
        };
        const width = getTextWidth(tick.value, `${tickConfig.fontSize}px Roboto`) + 15;

        return (<g transform={`translate(${tick.x - 20},${tick.y + 25})`}>
            <rect transform={`rotate(${tickRotation})`}
                  x={(-1 * (width) / 2 + 2)}
                  y={-6} rx={3} ry={3}
                  width={(width) + 2} height={22}
                  fill="rgba(255, 255, 255)"/>
            <rect transform={`rotate(${tickRotation})`}
                  x={(-1 * (width) / 2)}
                  y={-12}
                  rx={2}
                  ry={2} width={width} height={22}
                  fill={tickConfig.color}/>
            <circle className="bf9b314a-3cc5-4de7-9c56-1dcdbbfe5361" cx="20" cy="20" r="16"/>
            <ellipse className="e636d849-c039-47ee-8a84-0bf4236dd588" cx="20" cy="20" rx="11.27" ry="5.24"
                     transform="translate(-8.21 22.11) rotate(-49.28)"/>
            <ellipse className="e636d849-c039-47ee-8a84-0bf4236dd588" cx="21.05" cy="18.78" rx="2.57" ry="1.58"
                     transform="translate(-6.92 22.48) rotate(-49.28)"/>
            <text transform={`rotate(${tickRotation})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                      ...theme.axis.ticks.text,
                      fill: tickConfig.fontColor,
                      fontSize: "12px",
                  }}
            >

                <circle className="bf9b314a-3cc5-4de7-9c56-1dcdbbfe5361" cx="20" cy="20" r="16"/>
                <ellipse className="e636d849-c039-47ee-8a84-0bf4236dd588" cx="20" cy="20" rx="11.27" ry="5.24"
                         transform="translate(-8.21 22.11) rotate(-49.28)"/>
                <ellipse className="e636d849-c039-47ee-8a84-0bf4236dd588" cx="21.05" cy="18.78" rx="2.57" ry="1.58"
                         transform="translate(-6.92 22.48) rotate(-49.28)"/>
                {tick.value}
            </text>

        </g>)
    }

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
                    <Years data={years} onChange={handleYearFilterChange} maxSelectable={4}
                           defaultSelected={years.slice(0, 4)}/>
                </Grid.Column> : null}
            </Grid.Row>
            <Grid.Row className="legend-section">
                {generateLegends()}
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
                            axisBottom={{renderTick: CustomTick}}
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
