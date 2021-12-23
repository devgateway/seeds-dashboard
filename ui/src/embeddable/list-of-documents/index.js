import React, {useEffect} from "react";
import {Container} from "semantic-ui-react";
import {connect} from "react-redux";
import './styles.scss'
import {getDocuments} from "../reducers/data";
import {WP_DOCUMENTS} from "../reducers/StoreConstants";
import Documents from "./Documents";

const ListOfDocuments = ({
                             onLoadDocuments,
                             documents,
                             loading,
                             "data-type": dataType,
                             "data-show-inline": showInline = true
                         }) => {

    useEffect(() => {
        onLoadDocuments()
    }, []);

    const classes = 'styles';
    const childComponent = <Documents type={dataType} showInline={showInline} list={documents} loading={loading}/>
    return <Container fluid={true} className={classes}>{childComponent}</Container>
}

const mapStateToProps = (state, ownProps) => {
    return {
        documents: state.getIn([WP_DOCUMENTS, 'data']),
        loading: state.getIn([WP_DOCUMENTS, 'loading']),
        error: state.getIn([WP_DOCUMENTS, 'error'])
    }
}

const mapActionCreators = {
    onLoadDocuments: getDocuments
};

export default connect(mapStateToProps, mapActionCreators)(ListOfDocuments)
