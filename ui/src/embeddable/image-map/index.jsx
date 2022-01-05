import React from 'react'
import { getSlugFromFilters } from "../utils/common";

import { connect } from "react-redux";

const DEFAULT_FLAG = 'burkina-faso';
const ImageMap = ({
                    filters,
                    filtersData,
                    "data-values-filter-store": valuesFilterStore,
                    'data-selected-filter-store': selectedFilterStore
                  }) => {
  let slug = getSlugFromFilters(filters, filtersData, valuesFilterStore, selectedFilterStore);
  if (!slug) {
    slug = DEFAULT_FLAG;
  }
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