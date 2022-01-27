import React, {useState} from "react";
import {Grid} from "semantic-ui-react";
import {ResponsiveRadar} from '@nivo/radar'
import Source from "../common/source";
import Header from "../common/header";
import Years from "../common/filters/years";
import YearLegend from "../common/year";

const PerformanceSeedTraders = ({data, sources, title, subTitle}) => {
    const blueColors = [
        '#3377b6', '#7dafde', '#9fbfdc', '#c2dbf3'
    ];
    const FAKE_NUMBER = 0.00321;
    const [selectedYears, setSelectedYears] = useState(null);
    const [initialYears, setInitialYears] = useState(null);
    const [currentData, setCurrentData] = useState(null);

    const processedData = [];
    const keys = [];
    let maxSelectableYear = 5;
    let colors = new Map();

    if (!data || data.id === null) {
        return null;
    }
    let years = data.dimensions.year.values;
    let dimensionValues = data.dimensions.performance.values;

    if (data !== currentData) {
        setCurrentData(data);
        setSelectedYears(years);
        setInitialYears(years);
    }

    let max = 0;
    let indexBy = "id";

    // For initialization only.
    if (!initialYears) {
        setSelectedYears(years);
        setInitialYears(years);
    }

    dimensionValues.forEach(d => {
        const radarColors = [...performanceColors];
        const entry = {};
        entry[indexBy] =  d ;
        Object.keys(data.values[d]).forEach((i, j) => {
            if (selectedYears && selectedYears.find(k => k === i)) {
                const key = '' + i;
                entry[key] = Number(data.values[d][i]) >= 0 ? data.values[d][i] : FAKE_NUMBER;

                if (!keys.find(i => i === key)) {
                    keys.push(key);
                }
                if (!colors.get(key)) {
                    colors.set(key, radarColors.shift());
                }
                if (Number(entry[i]) > max) {
                    max = Number(entry[i]);
                }
            }
        });
        processedData.push(entry);
    });


    const getColors = (item) => {
        return colors.get(item.key);
    }

    const getLabel = (item) => {
        if (item == FAKE_NUMBER) {
            return "MD"
        } else {
            return item + "%"
        }
    }

    const handleYearFilterChange = (selected) => {
        setSelectedYears(selected);
    }
debugger
    return (
        <Grid className={`number-varieties-released`}>
            <Grid.Row className="header-section">
                <Grid.Column>
                    <Header title={`${title}`} subtitle={subTitle} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`filters-section`}>
                <Grid.Column>
                    <Years data={years} onChange={handleYearFilterChange} maxSelectable={maxSelectableYear}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`crops-with-icons`}>
                <Grid.Column width={8}>
                    <YearLegend colors={performanceColors} years={selectedYears} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`chart-section`}>
                <Grid.Column width={16}>
                    <div style={{height: 450}}>


                        <ResponsiveRadar
                            margin = {{ top: 60, right: 80, bottom: 60, left: 80 }}
                            data = {processedData}
                            indexBy = {indexBy}
                            keys = {keys}
                            dotSize = {2}
                            colors= {(item) => getColors(item)}
                            borderWidth = {3}
                            fillOpacity = {0}
                            blendMode = "multiply"
                            animate = {true}
                            motionConfig = "wobbly"
                            isInteractive = {true}
                            gridShape = "linear"
                            enableDotLabel = {true}
                            dotLabelYOffset = {15}
                            dotLabel = {d => getLabel(d.value)}
                            valueFormat = {d => getLabel(d)}
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

const performanceColors = [
    '#4D843F', '#F39C00', '#FBCC2A', '#E36A6A', '#289DF5'
];

export default PerformanceSeedTraders
