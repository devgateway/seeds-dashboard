import React from "react";
import {connect} from "react-redux";
import {Container, Dropdown, Popup, Input, Button} from "semantic-ui-react";
import {Image} from 'semantic-ui-react'
import './share.scss'

const Share = (props) => {
    const {
        "data-icon": icon = 'image',
        filterData
    } = props
    return <Container fluid={true} className={"share-wrapper"}>
                <ShareButton icon={icon} filterData={filterData}></ShareButton>
            </Container>
}

const ShareButton = ({icon, filterData}) => {

    return (

      <Popup content='Share as a link.' trigger={
        <Dropdown className="share">
        <Dropdown.Menu className='left'>
        <label>Get Link</label>
        <Input placeholder='url' />
        <Button onClick={e => {
        let params
        let url = window.location.href.split('?')[0]
        const filters = filterData;
        if (filters) {
            params = Object.entries({...filters.toJS()}).map(e => e.join('=')).join('&');
            url += '?' + params
        }
        navigator.clipboard.writeText(url)

    }}>Share Link</Button>

        </Dropdown.Menu>
      </Dropdown>
      } />
  )
}

const mapStateToProps = (state, ownProps) => {
    return {
        filterData: state.getIn(['data', 'filters'])
    }
}

const mapActionCreators = {

};

export default connect(mapStateToProps, mapActionCreators)(Share)
