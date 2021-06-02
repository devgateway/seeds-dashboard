import React from "react";
import {Container} from "semantic-ui-react";
import {Image} from 'semantic-ui-react'
import {toPng} from 'html-to-image';
import download from 'downloadjs'
import './print.scss'

const Print = (props) => {
    const {
        "data-icon": icon = 'image',
        "data-size": size = 'large',
        "data-color": color = 'grey',
        "data-htmlId": htmlId = 'exportable.chart',
        "data-downloadName": name = 'hhIndex'
    } = props
    return <Container fluid={true} className={"print tooltip-trigger icon-tooltip"}>
                <ImageExport icon={icon} size={size} color={color} id={htmlId} name={name}></ImageExport>
            </Container>
}

const delay = (time) => {
    return new Promise((resolve => window.setTimeout(resolve, time)))
}

const ImageExport = ({id, icon, name, color, size}) => {

    return (
      <span className="tooltip-trigger icon-tooltip">
      <Image src="/download.svg" size={size} className="wp-image-169" onClick={e => {
        var exportable = document.getElementById(id);

        toPng(exportable, {backgroundColor: "#FFF", style: {'border': '0px !important'}})
            .then(delay(1))
            .then(function (dataUrl) {
                console.log("printing")
                download(dataUrl, name + '.png');

            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
    }}></Image><span className="tooltip-text">Download as png.</span>
    </span>
  )
}



export default (Print)
