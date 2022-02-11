import React from "react";
import {Popup} from 'semantic-ui-react'
import './styles.scss';

const Export = ({methodology}) => {
    return (
        <div className="export-wrapper">
            <div className="export-buttons">
                <div className="export download"/>
                <div className="export share"/>
            </div>
            {methodology
                ? <Popup content={methodology} trigger={<div className="tooltip">Methodology</div>}
                         position='bottom right'/>
                : null}
        </div>
    )
}

export default Export
