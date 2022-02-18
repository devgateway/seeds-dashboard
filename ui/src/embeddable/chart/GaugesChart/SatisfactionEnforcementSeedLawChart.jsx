import React, {useState} from "react";
import {Grid} from "semantic-ui-react";
import './styles.scss';
import Gauge from "./components/Gauge";
import {range} from "./components/common";
import {injectIntl} from "react-intl";

const SatisfactionEnforcementSeedLawChart = ({data, yearsToShow, intl, tooltip}) => {
    const AVERAGE_RATING = "Overall satisfaction rating";
    const averageColumn = Object.keys(data.values);
    let avg = 0;

    if (!yearsToShow.find(i => i === AVERAGE_RATING) && yearsToShow.length > 1) {
        yearsToShow.push(AVERAGE_RATING);
    }

    const getCells = () => {
        return yearsToShow.map(y => {
            let cellValue = data.values[y];
            if (y === AVERAGE_RATING) {
                Object.keys(data.values).forEach(i => avg += data.values[i]);
                avg = avg / Object.keys(data.values).length;
                cellValue = (Math.round(avg * 10) / 10);
            }
            if (cellValue === "") {
                cellValue = undefined;
            }
            const r = range.find(r => cellValue >= r.min && cellValue <= r.max);
            let innerColor = "#818181";
            const particularGauge = [...dataGauge].map(i => ({...i}));
            if (r) {
                particularGauge[r.position - 1].id = particularGauge[r.position - 1].id + "_S";
                innerColor = r.color;
            } else {
                if (cellValue === undefined) {
                    cellValue = 'N/A'
                }
            }
            return <Grid.Column key={y + Math.random()}
                                className={"with-bottom-border " + (y === AVERAGE_RATING ? 'avg-cell' : '')}>
                <Gauge data={particularGauge}
                       height={45}
                       width={105}
                       innerValue={cellValue}
                       innerColor={innerColor}
                       tooltip={tooltip}/>
            </Grid.Column>
        })
    }

    const getData = () => {
        const yearCols = yearsToShow.map(y => {
            return <Grid.Column className={"years-title"} key={y + Math.random()}>{y}</Grid.Column>
        });
        const cropsWithAverage = [];
        if (averageColumn) {
            cropsWithAverage.push(averageColumn);
        }
        const dataCells = cropsWithAverage.map(c => getCells(c))
        return <Grid columns={yearsToShow.length}>
            {[...yearCols, ...dataCells]}
        </Grid>
    }

    const getMatrix = () => {
        return <>
            <Grid.Row>
                <Grid.Column width={1} className="title">
                    <div>{AVERAGE_RATING}</div>
                </Grid.Column>
                <Grid.Column width={15}>{getData()}</Grid.Column>
            </Grid.Row>
            <Grid.Row>&nbsp;</Grid.Row>
        </>
    }

    const dataGauge = [
        {id: "EP", value: 20},
        {id: "P", value: 20},
        {id: "F", value: 20},
        {id: "G", value: 20},
        {id: "E", value: 20}
    ];

    return <Grid className={'satisfaction-enforcement'}>
        {getMatrix()}
    </Grid>
}
export default injectIntl(SatisfactionEnforcementSeedLawChart);
