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
    return <Container fluid={true} className={"print-wrapper"}>
                <ImageExport icon={icon} size={size} color={color} id={htmlId} name={name}></ImageExport>
            </Container>
}

const delay = (time) => {
    return new Promise((resolve => window.setTimeout(resolve, time)))
}

const ImageExport = ({id, icon, downloadName, color, size}) => {

    return (
      <Popup content='Download as png.' trigger={
        <div onClick={e => {
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
        }}></div>
      } />
  )
}



export default (Print)
