import React from "react";
import {Container} from "semantic-ui-react";
import {Icon, Image} from 'semantic-ui-react'
import {toPng} from 'html-to-image';
import download from 'downloadjs'
import './print.scss'

const Print = (props) => {
    const {
        "data-icon": icon = 'image',
        "data-size": size = 'large',
        "data-color": color = 'grey',
        "data-htmlId": htmlId = 'exportable.chart',
        "data-name": name = 'hhIndex'
    } = props
    return <Container fluid={true} className={"print tooltip-trigger icon-tooltip"}>
                <ImageExport icon={icon} size={size} color={color} id={htmlId} name={name}></ImageExport>
            </Container>
}

const delay = (time) => {
    return new Promise((resolve => window.setTimeout(resolve, time)))
}

const ImageExport = ({id, icon, name, color, size}) => {

    return (<Image src="https://wp.tasai.dgstg.org/wp-content/uploads/2021/05/download.svg" size={size} className="wp-image-169" onClick={e => {
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
    }}></Image>)
}



export default (Print)