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

const VarietiesReleasedWithSpecialFeatures = ({data, sources}) => {

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
            let sumWF = 0;
            let sumWOF = 0;
            if (selectedYear) {
                sumWF = data.values[c][selectedYear].withspecialfeature || 0;
                sumWOF = data.values[c][selectedYear].withoutspecialfeature || 0;
            } else {
                Object.keys(data.values[c]).forEach(i => {
                    sumWF += data.values[c][i].withspecialfeature || 0;
                    sumWOF += data.values[c][i].withoutspecialfeature || 0;
                });
            }

            const key1 = 'withSpecialFeature_' + c;
            const key2 = 'withoutSpecialFeature_' + c;
            const header = {
                crop: c,
                [key1]: sumWF,
                [key2]: sumWOF,
            };
            processedData.push(header);
            keys.push(key1);
            keys.push(key2);
            colors.push(getColor({id: c.toLowerCase()}));
            colors.push(getColor({id: c.toLowerCase()}, {fade: true}));
            if (max < (sumWF + sumWOF)) {
                max = (sumWF + sumWOF);
            }
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
        const labelMargin = 20;

        const numbers = [];
        bars.forEach(({data: {data, indexValue}, x, width}, i) => {
            // sum of all the bar values in a stacked bar
            const total = Object.keys(data)
                //filter out whatever your indexBy value is
                .filter(key => key !== indexBy)
                .reduce((a, key) => a + data[key], 0);

            const transform = `translate(${x}, ${yScale(total) - labelMargin})`;
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
                        {total}
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
                    <Header title="Total Crops Released With and Without Special Features" subtitle=""/>
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
            {!noData ? <Grid.Row className={`crops-with-icons`}>
                <Grid.Column width={8}>
                    <CropsLegend data={selectedCrops} title="Crops" titleClass="crops-title" addLighterDiv={true}/>
                </Grid.Column>
                <Grid.Column width={8} className="withSeparator">
                    <CropsWithSpecialFeatures/>
                </Grid.Column>
            </Grid.Row> : null}
            <Grid.Row className={`chart-section`}>
                <Grid.Column width={16}>
                    <div style={{height: 450}}>
                        {!noData ? <ResponsiveBar
                            theme={theme}
                            layers={["grid", "axes", "bars", TotalLabels, "markers", "legends"]}
                            data={processedData}
                            keys={keys}
                            indexBy={indexBy}
                            margin={{top: 50, right: 60, bottom: 70, left: 70}}
                            padding={0.3}
                            valueScale={{type: 'linear', max: max * 1.25}}
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
                                legend: 'Number of Varieties Released',
                                legendPosition: 'middle',
                                legendOffset: -60,
                                tickValues: 6
                            }}
                            gridYValues={6}
                            enableLabel={false}
                            tooltip={(d) => {
                                return (<div className="tooltip-container-vrwsf">
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
                                                    <span
                                                        className="bold">{d.data[d.id]} out of {(d.data['withSpecialFeature_' + d.indexValue.toLowerCase()] || 0)
                                                    + (d.data['withoutSpecialFeature_' + d.indexValue.toLowerCase()] || 0)} </span>
                                                    <span>varieties released.</span>
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

export default VarietiesReleasedWithSpecialFeatures
