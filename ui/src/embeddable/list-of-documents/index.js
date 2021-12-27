import React, {useEffect} from "react";
import {Container} from "semantic-ui-react";
import {connect} from "react-redux";
import './styles.scss'
import {getDocuments, getWpCategories} from "../reducers/data";
import {DATA, WP_CATEGORIES, WP_DOCUMENTS} from "../reducers/StoreConstants";
import Documents from "./Documents";

const ListOfDocuments = ({
                             onLoadDocuments,
                             onLoadCategories,
                             documents,
                             loading,
                             error,
                             "data-type": dataType,
                             "data-show-inline": showInline = true,
                             categoriesWP,
                             selectedCountry: selectedCountryId,
                             countries
                         }) => {

    useEffect(() => {
        onLoadCategories()
    }, []);

    useEffect(() => {
        if (categoriesWP) {
            onLoadDocuments()
        }
    }, [categoriesWP]);

    const classes = 'styles reports';
    let filtered;
    // Match country in the media categories with country in the data filter component. 
    if (documents && selectedCountryId && countries) {
        const selectedCountry = countries.find(i => i.countryId === selectedCountryId);
        const countryCategory = categoriesWP.find(i=>i.name.toLowerCase() === selectedCountry.country.toLowerCase())
        if (countryCategory) {
            filtered = documents.filter(i => i.categories.find(j => j === countryCategory.id));
        }
    }
    const childComponent = <Documents type={dataType} showInline={showInline} list={filtered} loading={loading}
                                      error={error}/>
    return <Container fluid={true} className={classes}>{childComponent}</Container>
}

const mapStateToProps = (state, ownProps) => {
    return {
        documents: state.getIn([DATA, WP_DOCUMENTS, 'data']),
        loading: state.getIn([DATA, WP_DOCUMENTS, 'loading']),
        error: state.getIn([DATA, WP_DOCUMENTS, 'error']),
        categoriesWP: state.getIn([DATA, WP_CATEGORIES]),
        selectedCountry: state.getIn([DATA, 'filters', 'selected-country']),
        countries: state.getIn([DATA, 'countries'])
    }
}

const mapActionCreators = {
    onLoadDocuments: getDocuments,
    onLoadCategories: getWpCategories
};

export default connect(mapStateToProps, mapActionCreators)(ListOfDocuments)
