import React from 'react';
import {connect} from "react-redux";
import {Container, Dropdown, Popup, Input, Button} from "semantic-ui-react";
import './share.scss'

const Share = (props) => {
    const {
        "data-icon": icon = 'image',
        filterData
    } = props
    const contextRef = React.useRef()
    return <Container fluid={true} className={"share-wrapper"}>
                <div ref={contextRef}></div>
                <ShareButton icon={icon} filterData={filterData} contextRef={contextRef} ></ShareButton>
            </Container>
}

const ShareButton = ({icon, filterData, contextRef}) => {
    const [open, setOpen] = React.useState(false)
    return (
        <><Popup content='Share as a link.' trigger={getDropdown(filterData, setOpen, contextRef)} />
        <Popup content='Link copied' position='top left' context={contextRef} open={open} />
        </>      
  )
}

function show2ndPopup(setOpen) {
    setOpen(true)
    setTimeout(
        function() {
            setOpen(false);
        }
        .bind(this),
        3000
    );
}

function getDropdown(filterData, setOpen) {
    let params
    let url = window.location.href.split('?')[0]
    if (filterData) {
        params = Object.entries({...filterData.toJS()}).map(e => e.join('=')).join('&');
        url += '?' + params
    }
    return (
        <Dropdown className="share">
        <Dropdown.Menu className='left'>
        <label>Get Link</label>
        <Input placeholder={url} />
        <Button onClick={e => {
            navigator.clipboard.writeText(url)
            show2ndPopup(setOpen)
        }}>Copy Link</Button>
        </Dropdown.Menu>
      </Dropdown>
    )
}


const mapStateToProps = (state, ownProps) => {
    return {
        filterData: state.getIn(['data', 'filters']),
        url: state.getIn(['data', 'url'])
    }
}

const mapActionCreators = {

};

export default connect(mapStateToProps, mapActionCreators)(Share)
