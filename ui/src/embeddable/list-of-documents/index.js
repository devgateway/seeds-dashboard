import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import { connect } from "react-redux";
import { getDocuments, getWpCategories } from "../reducers/data";
import { DATA, WP_CATEGORIES, WP_DOCUMENTS, DATA_CATEGORY } from "../reducers/StoreConstants";
import Documents from "./Documents";
import { SELECTED_COUNTRY } from "../../seeds-commons/commonConstants";

const DOCUMENTS_PER_PAGE = 100;

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
                             countries,
                             "data-category": category,
                             "data-no-data-text": noDataText,
                             "data-document-slug-post-fix": documentSlugPostFix,
                             editing,
                             locale
                         }) => {
    useEffect(() => {
        onLoadCategories()
    }, [onLoadCategories]);

    useEffect(() => {
        if (categoriesWP && !loading) {
            const params = {};
            params.categories = category;
            params.per_page = DOCUMENTS_PER_PAGE;
            onLoadDocuments({ params })
        }
    }, [categoriesWP, onLoadDocuments]);

    const classes = 'styles reports';
    if (editing === 'true') {
        return <Container fluid={true} className={classes}>
            <span>The list of documents is available in preview mode only.</span>
        </Container>
    }

    let filtered;
    // Match country in the media categories with country in the data filter component.
    if (documents && selectedCountryId && countries && category !== '0') {
        const selectedCountry = countries.find(i => i.countryId === selectedCountryId);
        const countryCategory = categoriesWP.find(i => {
            // TODO: Change "slug" to "name".
            return i.slug.toLowerCase() === (selectedCountry.country.toLowerCase().replace(/\s+/g, '-').toLowerCase() + documentSlugPostFix)
                && i.parent === Number(category);
        });
        if (countryCategory) {
            filtered = documents.filter(i => i.categories.find(j => j === countryCategory.id)
                && i.categories.find(j => {
                    const catLocale = categoriesWP.find(k => k.name === locale);
                    return catLocale !== undefined && j === catLocale.id;
                }));
            if (filtered.length === 0) {
                // Default to other language.
                filtered = documents.filter(i => i.categories.find(j => j === countryCategory.id));
            }
        }
    }

    const childComponent = <Documents type={dataType} showInline={showInline} list={filtered}
                                      loading={loading || !countries || !selectedCountryId || !categoriesWP}
                                      error={error} noDataText={noDataText} />
    return <Container fluid={true} className={classes}>{childComponent}</Container>
}

const mapStateToProps = (state, ownProps) => {
    return {
        documents: state.getIn([DATA, WP_DOCUMENTS, 'data']),
        loading: state.getIn([DATA, WP_DOCUMENTS, 'loading']),
        error: state.getIn([DATA, WP_DOCUMENTS, 'error']),
        categoriesWP: state.getIn([DATA, WP_CATEGORIES]),
        selectedCountry: state.getIn([DATA, 'filters', SELECTED_COUNTRY]),
        countries: state.getIn([DATA, 'countries']),
        locale: state.getIn(['intl', 'locale']),
    }
}

const mapActionCreators = {
    onLoadDocuments: getDocuments, onLoadCategories: getWpCategories
};

export default connect(mapStateToProps, mapActionCreators)(ListOfDocuments)
