import React from 'react';
import { SearchContext } from '../providers/Context';

const SearchConsumer = props => {
  return /*#__PURE__*/React.createElement(SearchContext.Consumer, null, ({
    results,
    meta,
    locale
  }) => {
    return /*#__PURE__*/React.createElement(React.Fragment, null, React.Children.map(props.children, child => /*#__PURE__*/React.cloneElement(child, {
      results,
      meta,
      locale
    })));
  });
};

export default SearchConsumer;