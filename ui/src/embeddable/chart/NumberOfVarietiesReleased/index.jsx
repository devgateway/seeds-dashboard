import React, {useState} from "react";
import {Grid} from "semantic-ui-react";
import Line from "../Line";
import {ResponsiveLine} from "@nivo/line";
import Crops from "../crop";
import './styles.scss';
import Source from "../source";
import Filter from "../filter";

const defaultColor = '#000000';
const cropColors = {
    maize: '#efcb16',
    cowpea: '#f38e28',
    rice: '#3a5f2e',
    sorghum: '#798161',
    sunflower: defaultColor,
    ['soya bean']: '#84a43d',
    teff: defaultColor,
    bean: defaultColor,
    beans: defaultColor,
    groundnut: defaultColor,
    millet: defaultColor,
    wheat: defaultColor,
    pigeon: defaultColor
};
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

const NumberOfVarietiesReleased = ({data}) => {

    const [selectedCrops, setSelectedCrops] = useState(null);
    const [initialCrops, setInitialCrops] = useState(null);
    const [currentData, setCurrentData] = useState(null);

    const processedData = [];

    if (!data) {
        return null;
    }
    let crops = data.dimensions.crop.values;

    if (data !== currentData) {
        setCurrentData(data);
        setSelectedCrops(crops);
        setInitialCrops(crops);
    }

    const yearsInValues = Object.keys(data.values);
    const allYears = fillGaps(yearsInValues);

    // For initialization only.
    if (!initialCrops) {
        setSelectedCrops(crops);
        setInitialCrops(crops);
    } else {
        crops = selectedCrops;
    }

    crops.forEach(c => {
        const header = {
            id: c,
            data: [],
            color: cropColors[c.toLowerCase()] || defaultColor
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
                        <ResponsiveLine
                            theme={theme}
                            data={processedData}
                            /*enableSlices="x"*/
                            colors={{datum: 'color'}}
                            margin={{top: 50, right: 50, bottom: 50, left: 50}}
                            xScale={{type: 'point'}}
                            yScale={{type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false}}
                            yFormat=" >-.0r"
                            axisTop={null}
                            axisRight={null}
                            enableGridX={false}
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
                                legendPosition: 'middle',
                                format: e => Math.floor(e) === e && e
                            }}
                            pointBorderWidth={2}
                            pointSize={10}
                            pointColor={{from: 'color', modifiers: []}}
                            pointBorderColor={{from: 'serieColor', modifiers: []}}
                            pointLabelYOffset={-12}
                            useMesh={true}
                            tooltip={(d) => {
                                return (<div className="tooltip-container">
                                    <div className="header-container">
                                        <div className="header">
                                            <div className="inner-container">
                                                <div className={d.point.serieId.toLowerCase() + " crop-icon"}/>
                                                <div className="crop-name">{d.point.serieId}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="amount-container">
                                        <table width="100%">
                                            <thead>
                                            <tr>
                                                <td className="year"><span>Year</span></td>
                                                <td className="vr"><span>Varieties Released</span></td>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td className="year">{d.point.data.x}</td>
                                                <td>{d.point.data.y}</td>
                                            </tr>
                                            </tbody>
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
                    <Source title="Source: TASAI"/>
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
