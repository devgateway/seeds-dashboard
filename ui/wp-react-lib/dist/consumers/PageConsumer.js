import React from 'react';
import { PageContext } from '../providers/Context';

const PageConsumer = props => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageContext.Consumer, null, ({
    pages,
    meta,
    locale
  }) => {
    return pages && /*#__PURE__*/React.createElement(React.Fragment, null, React.Children.map(props.children, child => /*#__PURE__*/React.cloneElement(child, {
      pages,
      meta,
      locale
    })));
  }));
};

export default PageConsumer;