import React from 'react'
import { getSlugFromFilters } from "../utils/common";
import { WP_CATEGORIES } from "../reducers/StoreConstants";
import { getIndicatorsInformation, getWpCategories } from "../reducers/data";
import { connect } from "react-redux";

const ImageMap = ({
                    filters,
                    filtersData,
                    "data-values-filter-store": valuesFilterStore,
                    'data-selected-filter-store': selectedFilterStore
                  }) => {
  const slug = getSlugFromFilters(filters, filtersData, valuesFilterStore, selectedFilterStore);
  console.log(slug);
  return <figure className="wp-block-image size-large is-resized">
    <img loading="lazy"
         src={`${process.env.PUBLIC_URL}/images/country-maps/${slug}.svg`}
         alt="" className="wp-image-889" width="286"
         height="327" /></figure>
}


const mapStateToProps = (state) => {
  return {
    filters: state.getIn(['data', 'filters']),
    filtersData: state.getIn(['data']),
  }
}

const mapActionCreators = {};

export default connect(mapStateToProps, mapActionCreators)(ImageMap);