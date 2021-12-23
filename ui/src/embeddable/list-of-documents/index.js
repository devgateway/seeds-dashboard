import React, {useEffect} from "react";
import {Container} from "semantic-ui-react";
import {connect} from "react-redux";
import './styles.scss'
import {getDocuments} from "../reducers/data";
import {DATA, WP_DOCUMENTS} from "../reducers/StoreConstants";
import Documents from "./Documents";

const ListOfDocuments = ({
                             onLoadDocuments,
                             documents,
                             loading,
                             error,
                             "data-type": dataType,
                             "data-show-inline": showInline = true
                         }) => {

    useEffect(() => {
        onLoadDocuments()
    }, []);

    const classes = 'styles';
    const childComponent = <Documents type={dataType} showInline={showInline} list={documents} loading={loading}
                                      error={error}/>
    return <Container fluid={true} className={classes}>{childComponent}</Container>
}

const mapStateToProps = (state, ownProps) => {
    return {
        documents: state.getIn([DATA, WP_DOCUMENTS, 'data']),
        loading: state.getIn([DATA, WP_DOCUMENTS, 'loading']),
        error: state.getIn([DATA, WP_DOCUMENTS, 'error'])
    }
}

const mapActionCreators = {
    onLoadDocuments: getDocuments
};

export default connect(mapStateToProps, mapActionCreators)(ListOfDocuments)
