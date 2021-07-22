import React from 'react';
import { TaxonomyContext } from '../providers/Context';

const TaxonomyConsumer = props => {
  return /*#__PURE__*/React.createElement(TaxonomyContext.Consumer, null, ({
    taxonomies,
    locale
  }) => {
    return taxonomies && /*#__PURE__*/React.createElement(React.Fragment, null, React.Children.map(props.children, child => /*#__PURE__*/React.cloneElement(child, {
      taxonomies,
      locale
    })));
  });
};

export default TaxonomyConsumer;