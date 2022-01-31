import React, {useState} from "react";
import {Grid} from "semantic-ui-react";
import {ResponsiveLine} from "@nivo/line";
import CropsLegend from "../common/crop";
import './styles.scss';
import Source from "../common/source";
import CropFilter from "../common/filters/crops";
import Header from "../common/header";
import {getColor} from "../Countryinfo/CountryInfoChart";

const theme = {
    axis: {
        ticks: {
            text: {
                fontSize: 12,
                fill: "#adafb2",
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
            }
        }
    }
};

const NumberOfVarietiesReleased = ({ data, sources, title, subTitle, editing, type }) => {

    const [selectedCrops, setSelectedCrops] = useState(null);
    const [initialCrops, setInitialCrops] = useState(null);
    const [currentData, setCurrentData] = useState(null);

    const processedData = [];

    if (!data || data.id === null) {
        return <h2 className="no-data">No Data</h2>;
    }
    let crops = data.dimensions.crop.values;

    if (data !== currentData) {
        setCurrentData(data);
        setSelectedCrops(crops);
        setInitialCrops(crops);
        return null;
    }

    const yearsInValues = Object.keys(data.values);
    const allYears = fillGaps(yearsInValues);
    let max = 0;

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
            color: getColor({id: c.toLowerCase()})
        };
        yearsInValues.forEach(y => {
            if (data.values[y]) {
                header.data.push({
                    x: y,
                    y: data.values[y][c]
                });
                if (max < data.values[y][c]) {
                    max = data.values[y][c];
                }
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
            <Grid.Row className="header-section">
                <Grid.Column>
                    <Header title={`${title}`} subtitle={subTitle} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`filters-section`}>
                <Grid.Column>
                    <CropFilter data={initialCrops} onChange={handleCropFilterChange}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`crops-with-icons`}>
                <Grid.Column width={8}>
                    <CropsLegend data={selectedCrops} title="Crops" titleClass="crops-title"/>
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
                            margin={{top: 50, right: 60, bottom: 70, left: 70}}
                            xScale={{type: 'point'}}
                            yScale={{type: 'linear', min: 'auto', max: max * 1.15, stacked: false, reverse: false}}
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
                                legendOffset: 45,
                                legendPosition: 'middle'
                            }}
                            axisLeft={{
                                orient: 'left',
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Number of varieties released',
                                legendOffset: -60,
                                legendPosition: 'middle',
                                format: e => Math.floor(e) === e && e,
                                tickValues: 5
                            }}
                            gridYValues={5}
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
                                            <div className="table">
                                                <label style={{float: 'left'}} className="year">Year</label>
                                                <label style={{float: 'right'}} className="vr">Varieties Released</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="amount-container">
                                        <table width="100%">
                                            <tr>
                                                <td className="year">{d.point.data.x}</td>
                                                <td style={{fontWeight: 'bold'}}>{d.point.data.y}</td>
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
                    <Source title={`Source: ${sources}${editing ? ` *${type}*` : ''}`} />
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
