import React, {useRef, useState} from "react";
import {Container, Popup} from "semantic-ui-react";
import {saveAs} from 'file-saver';
import {toBlob} from 'html-to-image';
import './print.scss'

const delay = (time) => {
    return new Promise((resolve => window.setTimeout(resolve, time)))
}

const findAncestor = (el, sel) => {
    while ((el = el.parentElement) && !el.classList.contains(sel));
    return el;
}

function filter(el) {
    if (el.classList) {
        return !el.classList.contains("ignore")
    }
    return true;
}

const Print = (props) => {
    const {
        "data-icon": icon = 'image',
        "data-size": size = 'large',
        "data-color": color = 'grey',
        "data-htmlClass": htmlClass = 'chart-wrapper',
        "data-downloadname": downloadName = 'hhIndex'
    } = props
    const contextRef = useRef()
    const [popUpOpen, setPopUpOpen] = useState(false)
    const [popUpMessage, setPopUpMessage] = useState('Downloading image...')
    return(
        <Container fluid={true} className={"print-wrapper"}>
            <>
                <Popup content={popUpMessage} open={popUpOpen} position='top left' context={contextRef} />
                <Popup content={`Download as png.`} trigger={
                    <div ref={contextRef} onClick={e => {
                        setPopUpMessage('Downloading image...')
                        setPopUpOpen(true)
                        var exportable = findAncestor(contextRef.current, htmlClass)
                        toBlob(exportable, {
                            filter,
                            "backgroundColor": "#FFF",
                        }).then(delay(1)).then(function (blob) {
                            saveAs(blob, downloadName + '.png');
                            setPopUpOpen(false)
                        }).catch(function (error) {
                            console.error('oops, something went wrong!', error)
                            setPopUpOpen(false)
                        });
                    }} >
                    </div>
                }/>
            </>
        </Container>
    )
}

export default (Print)
