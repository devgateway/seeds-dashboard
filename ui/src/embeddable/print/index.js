import React from "react";
import {Container, Popup} from "semantic-ui-react";
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
        "data-downloadname": downloadName = 'hhIndex'
    } = props
    const contextRef = React.useRef()
    return(
        <> <div ref={contextRef}></div>
            <Container fluid={true} className={"print-wrapper"}>
                <ImageExport icon={icon} size={size} color={color} id={htmlId} downloadName={downloadName} contextRef={contextRef}></ImageExport>
            </Container>
        </>)
}

const delay = (time) => {
    return new Promise((resolve => window.setTimeout(resolve, time)))
}

function show2ndPopup(setOpen) {
    setOpen(true)
    setTimeout(
        function() {
            setOpen(false);
        }
        .bind(this),
        2000
    );
}

const ImageExport = ({id, icon, downloadName, color, size, contextRef}) => {
    const [open, setOpen] = React.useState(false)
    return (
        <>
        <Popup content='Download as png.' trigger={
            <div onClick={e => {
                var exportable = document.getElementById(id);

                toPng(exportable, {backgroundColor: "#FFF", style: {'border': '0px !important'}})
                    .then(show2ndPopup(setOpen))
                    .then(delay(1))
                    .then(function (dataUrl) {
                        console.log("printing")
                        download(dataUrl, downloadName + '.png')
                    })
                    .catch(function (error) {
                        console.error('oops, something went wrong!', error);
                    });
                }}></div>
            } />
        <Popup content='Downloading image...' position='top left' context={contextRef} open={open} />
        </> 
  )
}



export default (Print)
