import React from 'react';
import {connect} from "react-redux";
import {Container, Dropdown, Popup, Input, Button} from "semantic-ui-react";
import './share.scss'

const Share = (props) => {
    const {
        "data-icon": icon = 'image',
        filterData
    } = props
    return <Container fluid={true} className={"share-wrapper"}>
                <ShareButton icon={icon} filterData={filterData} ></ShareButton>
            </Container>
}

const ShareButton = ({icon, filterData}) => {
    return (
      <Popup content='Share as a link.' trigger={getDropdown(filterData)} />
  )
}

function getDropdown(filterData) {
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
