import React from "react";
import {Popup} from 'semantic-ui-react'
import './styles.scss';

const Export = ({methodology, download, exportPng}) => {
    return (
        <div className="export-wrapper">
            <div className="export-buttons">
                {download === 'true' ? <div className="export download" onClick={e => exportPng()}/> : null}
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
