function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { IntlProvider } from "react-intl";
import { AppContext } from "../providers/Context";
import { AppContextProvider } from "../../dist";

class EmbeddedGateway extends React.Component {
  constructor(props) {
    super(props);
    this.renderEmbeddedComponents = this.renderEmbeddedComponents.bind(this);
  }

  renderEmbeddedComponents() {
    const {
      locale,
      store,
      getComponent
    } = this.props;
    const node = ReactDOM.findDOMNode(this);
    const elements = node.getElementsByClassName("wp-react-lib-component");

    if (!(elements == null)) {
      Array.from(elements).forEach((element, index) => {
        const component = element.getAttribute('data-component');
        element.removeAttribute("data-component");

        if (component) {
          const props = { ...this.props
          };
          const attrs = element.attributes;

          for (let i = attrs.length - 1; i >= 0; i--) {
            props[attrs[i].name] = attrs[i].value;
          }

          const C = getComponent(component);

          if (C) {
            ReactDOM.render( /*#__PURE__*/React.createElement(Provider, {
              store: store
            }, /*#__PURE__*/React.createElement(IntlProvider, {
              locale: locale
            }, /*#__PURE__*/React.createElement(AppContextProvider, {
              getComponent: getComponent,
              store: store,
              locale: locale
            }, /*#__PURE__*/React.createElement(C, _extends({
              unique: "embeddable_" + index
            }, props, {
              childContent: element.innerHTML
            }))))), element);
          } else {
            ReactDOM.render( /*#__PURE__*/React.createElement("span", {
              style: {
                "color": "red"
              }
            }, component, " not found "), element);
          }
        }
      });
    }
  }

  componentDidMount() {
    this.renderEmbeddedComponents();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      parent
    } = this.props;

    if (parent != prevProps.parent) {
      this.renderEmbeddedComponents();
    }
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, this.props.children);
  }

}

const WithContext = props => {
  return /*#__PURE__*/React.createElement(AppContext.Consumer, null, data => {
    if (data) {
      return /*#__PURE__*/React.createElement(EmbeddedGateway, _extends({
        locale: data.locale,
        store: data.store,
        getComponent: data.getComponent
      }, props), props.children);
    } else {
      return /*#__PURE__*/React.createElement(React.Fragment, null, props.children, " ");
    }
  });
};

export default WithContext;