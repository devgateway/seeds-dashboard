import React from "react";
import {
    Page,
    PageConsumer,
    PageProvider,
    PageNotFound
} from "@devgateway/wp-react-lib";
import { WP_CATEGORIES } from "../reducers/StoreConstants";
import { getIndicatorsInformation, getWpCategories } from "../reducers/data";
import { connect } from "react-redux";
import { getSlugFromFilters } from "../utils/common";

const innerPage = ({
                       "data-height": height, editing,
                       "data-default-page": defaultPage,
                       "data-values-filter-store": valuesFilterStore,
                       "data-selected-filter-store": selectedFilterStore,
                       "data-connect-filter": connectFilter, messages,
                       "data-slug-pre-fix": slugPrefix,
                       filters, filtersData


                   }) => {
    const isEditing = editing === 'true';
    const contentHeight = isEditing ? height - 30 : height;
    let slug;
    if (!isEditing) {
        const slugArray = getSlugFromFilters(filters, filtersData, valuesFilterStore, selectedFilterStore);
        if (slugArray && slugArray.length) {
            slug = slugPrefix + slugArray[0];
        }
    } else {
        slug = defaultPage;
    }
    return <div style={{ 'height': contentHeight + 'px' }}>
        {slug ? <PageProvider
            slug={slug}
            store={slug}
            messages={messages}
            fallbackComponent={<DefaultPage slug={defaultPage} messages={messages} />}
        >
            <PageConsumer>
                <Page />
            </PageConsumer>
        </PageProvider> : <PageNotFound />}

    </div>
}

const mapStateToProps = (state) => {
    return {
        filters: state.getIn(['data', 'filters']),
        categoriesWP: state.getIn(['data', WP_CATEGORIES]),
        filtersData: state.getIn(['data']),
    }
}

const mapActionCreators = {
    onLoadIndicatorsInformation: getIndicatorsInformation,
    onLoadWPCategories: getWpCategories
};

export default connect(mapStateToProps, mapActionCreators)(innerPage);
const DefaultPage = ({ slug, messages }) => {
    return <PageProvider
        slug={slug}
        store={slug}
        messages={messages}
    >
        <PageConsumer>
            <Page />
        </PageConsumer>
    </PageProvider>
}