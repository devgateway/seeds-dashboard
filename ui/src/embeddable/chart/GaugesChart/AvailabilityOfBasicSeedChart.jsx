import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import './styles.scss';
import Gauge from "./components/Gauge";
import { range } from "./components/common";
import { injectIntl } from "react-intl";

const AvailabilityOfBasicSeedChart = ({ data, yearsToShow, intl }) => {
  const averageColumn = Object.keys(data.values).find(v => !data.dimensions.crop.values.includes(v));
  const getCells = (crop) => {
    return yearsToShow.map(y => {
      let cellValue = data.values[crop][y];
      if (cellValue === "") {
        cellValue = undefined;
      }
      const r = range.find(r => cellValue >= r.min && cellValue <= r.max);
      let innerColor = "#818181";
      const particularGauge = [...dataGauge].map(i => ({ ...i }));
      if (r) {
        particularGauge[r.position - 1].id = particularGauge[r.position - 1].id + "_S";
        innerColor = r.color;
      } else {
        if (cellValue === undefined) {
          cellValue = 'N/A'
        }
      }
      return <Grid.Column className={"with-bottom-border"} key={`${crop}__${y}`}>
        <Gauge data={particularGauge}
               height={45}
               width={105}
               innerValue={cellValue}
               innerColor={innerColor} /></Grid.Column>
    })
  }
  const getData = () => {
    const yearCols = yearsToShow.map(y => {
      return <Grid.Column className="years-title" key={y}>{y}</Grid.Column>
    });
    const cropsWithAverage = [...data.dimensions.crop.values];
    if (averageColumn) {
      cropsWithAverage.push(averageColumn);
    }
    const dataCells = cropsWithAverage.map(c => getCells(c))
    return <Grid columns={yearsToShow.length}>
      {[...yearCols, ...dataCells]}
    </Grid>
  }
  const getCrops = () => {
    const crops =
      data.dimensions.crop.values.map(c => {
        return <Grid.Column key={c} className={"crop-container"}>
          <div className={`crop ${c}`}>{c}</div>
        </Grid.Column>
      });
    crops.unshift(<Grid.Column key={'title'} />);
    if (averageColumn) {
      crops.push(<Grid.Column className={'crop average'}>{intl.formatMessage({
        id: `average-rating`,
        defaultMessage: 'Average Rating'
      })}</Grid.Column>);
    }

    return <Grid columns={1}>{crops}</Grid>;
  }
  const getMatrix = () => {
    return <Grid.Row><Grid.Column width={1} className={"seeds-title"}>
      <div>Seeds</div>
    </Grid.Column><Grid.Column width={2} className={"seeds-list"}>{getCrops()}</Grid.Column><Grid.Column
      width={13}>{getData()}</Grid.Column></Grid.Row>;
  }
  const dataGauge = [
    { id: "EP", value: 20 },
    { id: "P", value: 20 },
    { id: "F", value: 20 },
    { id: "G", value: 20 },
    { id: "E", value: 20 }
  ];

  return <Grid className={'availability-of-basic-seed'}>{getMatrix()}</Grid>;
}
export default injectIntl(AvailabilityOfBasicSeedChart);
