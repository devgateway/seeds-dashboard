import React from "react";
import {connect} from "react-redux";
import {Container} from "semantic-ui-react";
import {Image} from 'semantic-ui-react'
import './share.scss'

const Share = (props) => {
    const {
        "data-icon": icon = 'image',
        filterData
    } = props
    return <Container fluid={true} className={"print tooltip-trigger icon-tooltip"}>
                <ShareButton icon={icon} filterData={filterData}></ShareButton>
            </Container>
}



const ShareButton = ({icon, filterData}) => {

    return (<Image src="https://wp.tasai.dgstg.org/wp-content/uploads/2021/05/share.svg"  className="wp-image-168"
    onClick={e => {
        let params
        let url = window.location.href.split('?')[0]
        const filters = filterData;
        if (filters) {
            params = Object.entries({...filters.toJS()}).map(e => e.join('=')).join('&');
            url += '?' + params
        }
        navigator.clipboard.writeText(url)

    }}></Image>)
}

const mapStateToProps = (state, ownProps) => {
    return {
        filterData: state.getIn(['data', 'filters'])
    }
}

const mapActionCreators = {

};

export default connect(mapStateToProps, mapActionCreators)(Share)