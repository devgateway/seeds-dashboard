import React from 'react';
import { AppContext } from './Context';

class AppContextProvider extends React.Component {
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    const {
      locale,
      store,
      getComponent
    } = this.props;
    return /*#__PURE__*/React.createElement(AppContext.Provider, {
      value: {
        store,
        getComponent,
        locale
      }
    }, this.props.children);
  }

}

export default AppContextProvider;