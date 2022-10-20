import { PostConsumer, PostIntro, PostProvider } from "@devgateway/wp-react-lib";

import 'pure-react-carousel/dist/react-carousel.es.css';
import React, { useEffect, useState } from "react";
import { Container, Icon, Loader } from "semantic-ui-react";
import { connect } from "react-redux";
import { getCrops, getDocuments, getIndicatorsInformation, getWpCategories } from "../reducers/data";
import { WP_CATEGORIES } from "../reducers/StoreConstants";
import { getSlugFromFilters } from "../utils/common";
import { DOCUMENTS_PER_PAGE } from "../../seeds-commons/commonConstants";
import Carousel from "./Carousel";
import { injectIntl } from "react-intl";

export const POST_CAROUSEL_CONTAINER = 'postCarouselContainer';

const PostCarousel = ({
                          "data-type": type,
                          "data-taxonomy": taxonomy,
                          "data-height": height = 650,
                          "data-categories": categories,
                          "data-items": items,
                          "data-orientation": orientation = 'horizontal',
                          "data-items-per-page": itemsPerPage = 1,
                          editing, parent, unique,
                          messages,
                          "data-connect-filter": connectFilter,
                          "data-values-filter-store": valuesFilterStore,
                          "data-selected-filter-store": selectedFilterStore,
                          "data-navigator-style": navigatorStyle,
                          "data-scheduled-filter": scheduledFilter,
                          "data-scheduled-filter-store": scheduledFilterStore = 'past',
                          "data-show-links-in-modal": showLinksInModal,
                          "data-show-sorted-by-country-and-year-categories": sortedByCountryAndYearCategories = 'false',
                          "data-show-two-columns": twoColumns = 'false',
                          "data-preload-document-and-crops": preloadDocumentsAndCrops = 'false',
                          'data-new-implementation': newImplementation = 'false',
                          'data-filter-default-category': strDefaultCategory,
                          filters, filtersData, categoriesWP, onLoadWPCategories,
                          onLoadCrops, onLoadDocuments,
                          intl,
                          locale
                      }) => {
    let orCategoriesArray;
    let defaultCategory;

    const isConnectFilter = connectFilter === 'true';
    const isNewImplementation = newImplementation === 'true';
    const isTwoColumns = twoColumns === 'true';
    const isSortedByCountryAndYearCategories = sortedByCountryAndYearCategories === 'true';
    const isPreloadDocumentsAndCrops = preloadDocumentsAndCrops === 'true';

    if (strDefaultCategory && !isNaN(strDefaultCategory)) {
        defaultCategory = parseInt(strDefaultCategory);
    }
    useEffect(() => {
        if (isPreloadDocumentsAndCrops) {
            onLoadCrops({});
            const params = {};
            params.per_page = DOCUMENTS_PER_PAGE;
            onLoadDocuments({ params })
            onLoadWPCategories('COUNTRY-REPORTS')
        }
        if (isConnectFilter) {
            onLoadWPCategories();
        }
    }, [taxonomy, categories, onLoadWPCategories])
    if (isConnectFilter && categoriesWP) {
        //orCategoriesArray = [];
        const slugArray = getSlugFromFilters(filters, filtersData, valuesFilterStore, selectedFilterStore);
        if (slugArray && slugArray.length > 0) {
            //TODO when changing the categories fix search by slug or name
            //categoryWP = categoriesWP.filter(cwp => cwp.slug === `c-${slug}`);
            let categoriesWPFiltered;
            if (isNewImplementation) { //TODO until SEEDSDT-839 is done we add a c- to countries slugs. added
                // a param to know its the new carousel (for now country reports and seeds news
                categoriesWPFiltered = categoriesWP.filter(cwp => slugArray.map(sa => `c-${sa}`).includes(cwp.slug));
            } else {
                categoriesWPFiltered = categoriesWP.filter(cwp => slugArray.includes(cwp.slug));
            }
            if (categoriesWPFiltered) {
                orCategoriesArray = categoriesWPFiltered.map(orC => orC.id);
            } else {
                //TODO add not-found as a parameter
                //FI NOT FOUND
                //categoryWP = categoriesWP.find(cwp => cwp.slug === 'not-found');
            }
        }
    }
    if (isConnectFilter && !categoriesWP) {
        return <Container>
            <span>{intl.formatMessage({ id: 'loading', defaultMessage: 'Loading' })}</span>
            <Loader inverted content={intl.formatMessage({ id: 'loading', defaultMessage: 'Loading' })} />
        </Container>;
    } else {
        return <Container className={`wp-react-lib post carousel ${editing ? 'editing' : ''}`} fluid={true}
                          style={{ "height": height + 'px' }} id={POST_CAROUSEL_CONTAINER}>
            <PostProvider type={type} taxonomy={taxonomy}
                          categories={orCategoriesArray && !isNewImplementation ? orCategoriesArray.join(',') : categories}
                          categoriesOr={orCategoriesArray && isNewImplementation ? orCategoriesArray : undefined}
                          store={"carousel_" + parent + "_" + unique} page={1}
                          perPage={items > 0 ? items : undefined} isScheduledFilter={scheduledFilter === 'true'}
                          scheduledFilterStore={scheduledFilterStore}
                          categoryDefault={defaultCategory}
            >
                <PostConsumer>
                    <Carousel itemsPerPage={itemsPerPage} messages={messages} orientation={orientation}
                              navigatorStyle={navigatorStyle} type={type} showLinksInModal={showLinksInModal}
                              categories={categoriesWP} isTwoColumns={isTwoColumns}
                              isSortedByCountryAndYearCategories={isSortedByCountryAndYearCategories}
                    />
                </PostConsumer>
            </PostProvider>
        </Container>
    }
}
const mapStateToProps = (state) => {
    return {
        filters: state.getIn(['data', 'filters']),
        categoriesWP: state.getIn(['data', WP_CATEGORIES]),
        filtersData: state.getIn(['data']),
        locale: state.getIn(['intl', 'locale']),
    }
}

const mapActionCreators = {
    onLoadIndicatorsInformation: getIndicatorsInformation,
    onLoadWPCategories: getWpCategories,
    onLoadCrops: getCrops,
    onLoadDocuments: getDocuments,
};

export default connect(mapStateToProps, mapActionCreators)(injectIntl(PostCarousel));
