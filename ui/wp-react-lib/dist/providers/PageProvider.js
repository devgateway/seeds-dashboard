import React from 'react';
import { Container, Loader, Segment } from "semantic-ui-react";
import { connect } from 'react-redux';
import { PageContext } from './Context';
import { clean, getPages } from "../reducers/actions";
import LocalizedProvider from "./LocalizedProvider";
/*
Will load a post base ond passed properties and put in PostContext
*/

class PageProvider extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      before,
      perPage,
      page,
      fields,
      parent,
      slug,
      store = "pages",
      locale,
      previewNonce,
      previewId,
      search
    } = this.props;

    if (prevProps.parent !== parent || prevProps.slug !== slug || locale !== prevProps.locale || previewId !== prevProps.previewId | search != prevProps.search) {
      this.props.onLoad({
        before,
        perPage,
        page,
        fields,
        parent,
        slug,
        store,
        locale,
        previewNonce,
        previewId,
        search
      });
    }
  }

  componentDidMount() {
    const {
      before,
      perPage,
      page,
      fields,
      parent,
      slug,
      store = "pages",
      locale,
      previewNonce,
      previewId,
      search
    } = this.props;
    this.props.onLoad({
      before,
      perPage,
      page,
      fields,
      parent,
      slug,
      store,
      locale,
      previewNonce,
      previewId,
      search
    });
  }

  componentWillUnmount() {
    const {
      before,
      perPage,
      page,
      fields,
      parent,
      slug,
      store = "pages",
      locale
    } = this.props;
    this.props.onClean({
      store
    });
  }

  render() {
    const {
      pages,
      meta,
      loading,
      error,
      fallbackComponent,
      locale
    } = this.props;

    if (pages && pages.length > 0) {
      return /*#__PURE__*/React.createElement(PageContext.Provider, {
        value: {
          pages,
          meta,
          locale
        }
      }, this.props.children);
    } else if (error) {
      return /*#__PURE__*/React.createElement(Segment, {
        color: "red"
      }, /*#__PURE__*/React.createElement("h1", null, "500"), /*#__PURE__*/React.createElement("p", null, "The service is not available please try again in a few minutes"));
    } else if (loading) {
      return /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(Loader, {
        inverted: true,
        content: "Loading"
      }));
    } else if (loading === false) {
      if (fallbackComponent) {
        return /*#__PURE__*/React.createElement(React.Fragment, null, fallbackComponent);
      } else {
        return /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(Segment, {
          color: "red"
        }, /*#__PURE__*/React.createElement("h1", null, "404"), /*#__PURE__*/React.createElement("p", null, "Can't find this page")));
      }
    }

    return null;
  }

}

const mapStateToProps = (state, ownProps) => {
  const {
    store = "pages"
  } = ownProps;
  return {
    error: state.getIn(['wordpress', store, 'error']),
    meta: state.getIn(['wordpress', store, 'meta']),
    pages: state.getIn(['wordpress', store, 'items']),
    loading: state.getIn(['wordpress', store, 'loading'])
  };
};

const mapActionCreators = {
  onClean: clean,
  onLoad: getPages
};
export default LocalizedProvider(connect(mapStateToProps, mapActionCreators)(PageProvider));