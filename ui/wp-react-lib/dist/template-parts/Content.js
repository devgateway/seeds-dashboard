function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import EmbeddedGateway from '../embedded/EmbeddedGateway';
import { Container } from "semantic-ui-react";
import { replaceHTMLinks, replaceLink } from "../util";

const Enhance = props => {
  const Component = props.as ? props.as : Container;
  const filteredProps = ['post', 'pageNumber', 'visibility', 'intl', "as"];
  const newProps = {};
  Object.keys(props).filter(p => p).forEach(e => {
    if (filteredProps.indexOf(e) == -1) {
      newProps[e] = props[e];
    }
  });
  return /*#__PURE__*/React.createElement(Component, newProps, props.children);
};

class Content extends React.Component {
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    const {
      post,
      pageNumber,
      showTitle,
      showContent,
      showIntro,
      showLink,
      showDate,
      showLoading,
      as,
      locale,
      messages,
      preview
    } = this.props;

    if (post) {
      const contentParts = post.content ? post.content.rendered.split("<!--more-->") : [];
      const intro = contentParts.length > 1 ? contentParts[0] : null;
      const content = contentParts.length > 1 ? contentParts[1] : contentParts[0];
      const pages = content ? content.split("<!--nextpage-->") : '';
      let body = '';

      if (pageNumber != null && pages.length > 0) {
        body = pages[pageNumber];
      } else {
        body = content;
      }

      return /*#__PURE__*/React.createElement(EmbeddedGateway, {
        locale: locale,
        messages: messages,
        parent: preview ? post.parent : post.id
      }, /*#__PURE__*/React.createElement(Enhance, _extends({
        className: "entry-content"
      }, this.props), showDate && /*#__PURE__*/React.createElement(Container, {
        fluid: true,
        className: "date"
      }, post.date.toLocaleString()), showTitle && /*#__PURE__*/React.createElement("span", {
        className: "title",
        dangerouslySetInnerHTML: {
          __html: post.title.rendered
        }
      }), showIntro && /*#__PURE__*/React.createElement(Container, {
        fluid: true,
        className: "excerpt",
        dangerouslySetInnerHTML: {
          __html: replaceHTMLinks(intro, locale)
        }
      }), showContent && /*#__PURE__*/React.createElement(Container, {
        fluid: true,
        className: "content",
        dangerouslySetInnerHTML: {
          __html: replaceHTMLinks(body, locale)
        }
      }), showLink === true && /*#__PURE__*/React.createElement("a", {
        href: replaceLink(post.link),
        className: "link"
      }, "Read More")));
    } else {
      return showLoading ? 'Loading' : false;
    }
  }

}

export default Content;