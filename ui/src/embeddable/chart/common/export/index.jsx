import React from "react";
import { Popup } from 'semantic-ui-react'
import './styles.scss';

const Export = ({methodology}) => {
    return (
        <div className="export-wrapper">

        <div className="export-buttons">
          <div className="export download"></div>
          <div className="export share"></div>
        </div>

        <Popup content='Methodology text' trigger={<div className="tooltip">Methodology</div>} position='bottom right' />

        </div>
    )
}

export default Export
