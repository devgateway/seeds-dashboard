import React from "react";
import {Popup} from 'semantic-ui-react'
import './styles.scss';

const Export = ({methodology, download, exportPng, containerRef, type}) => {
    return (
        <div className="export-wrapper">
            <div className="export-buttons">
                {download === 'true'
                    ? <div className="export download" onClick={e => exportPng(containerRef, type)}/>
                    : null}
                <div className="export share"/>
            </div>
            {methodology
                ? <Popup className="methods-popup" content={methodology} trigger={<div className="tooltip">Methods</div>}
                         position='bottom right'/>
                : null}
        </div>
    )
}

export default Export
