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

    let max = 0;

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
        header.color = getColor({id: c.toLowerCase()});

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
        keys: years,
        padding: 0.2,
        labelTextColor: "inherit:darker(1.4)",
        labelSkipWidth: 16,
        labelSkipHeight: 16,
        groupMode:"grouped"
    };

    return (
        <Grid className={`number-varieties-released`}>
            <Grid.Row className="header-section">
                <Grid.Column>
                    <Header title="Number of Varieties Sold"/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`filters-section`}>
                <Grid.Column>
                    <CropFilter data={initialCrops} onChange={handleCropFilterChange}/>
                </Grid.Column>
                <Grid.Column>
                    <Years data={years} onChange={handleYearFilterChange}/>
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


                        <ResponsiveBar {...commonProps} />
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

export default NumberVarietiesSold
