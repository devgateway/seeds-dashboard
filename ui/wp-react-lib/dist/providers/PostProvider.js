import React from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../reducers/actions';
import { PostContext } from './Context';
import { Container, Loader, Segment } from "semantic-ui-react";
import LocalizedProvider from "./LocalizedProvider";

class PostProvider extends React.Component {
  componentDidMount() {
    const {
      type = 'posts',
      taxonomy,
      categories,
      before,
      perPage,
      page,
      fields,
      slug,
      store = "posts",
      locale,
      previewNonce,
      previewId,
      search
    } = this.props;
    this.props.onLoadPost({
      slug,
      type,
      taxonomy,
      categories,
      before,
      perPage,
      page,
      fields,
      store,
      locale,
      previewNonce,
      previewId,
      search
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      type = 'posts',
      taxonomy,
      categories,
      before,
      perPage,
      page,
      fields,
      slug,
      store = "posts",
      locale,
      previewNonce,
      previewId,
      search
    } = this.props;

    if (categories != prevProps.categories || locale != prevProps.locale || slug != prevProps.slug || taxonomy != prevProps.taxonomy || page != prevProps.page || perPage != prevProps.perPage || search != prevProps.search) {
      this.props.onLoadPost({
        slug,
        type,
        taxonomy,
        categories,
        before,
        perPage,
        page,
        fields,
        store,
        locale,
        previewNonce,
        previewId,
        search
      });
    }
  }

  render() {
    const {
      posts,
      meta,
      loading,
      error,
      locale
    } = this.props;
    debugger;

    if (posts && posts.length > 0) {
      return /*#__PURE__*/React.createElement(PostContext.Provider, {
        value: {
          posts,
          locale,
          meta
        }
      }, this.props.children);
    } else if (error) {
      return /*#__PURE__*/React.createElement(Segment, {
        color: "red"
      }, /*#__PURE__*/React.createElement("h1", null, "500"), /*#__PURE__*/React.createElement("p", null, "The service is not available please try again in a few minutes"));
    } else if (loading) {
      return /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(Loader, null, "Loading"));
    } else {
      return /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(Segment, {
        color: "red"
      }, /*#__PURE__*/React.createElement("p", null, "No entries found")));
    }
  }

}

const mapStateToProps = (state, ownProps) => {
  const {
    store = "posts"
  } = ownProps;
  return {
    meta: state.getIn(['wordpress', store, 'meta']),
    posts: state.getIn(['wordpress', store, 'items']),
    error: state.getIn(['wordpress', store, 'error']),
    loading: state.getIn(['wordpress', store, 'loading'])
  };
};

const mapActionCreators = {
  onLoadPost: getPosts
};
export default LocalizedProvider(connect(mapStateToProps, mapActionCreators)(PostProvider));