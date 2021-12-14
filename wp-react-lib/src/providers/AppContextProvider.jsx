import React from 'react'
import {AppContext} from './Context'

class AppContextProvider extends React.Component {


    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    render() {
        const {locale, store, getComponent, messages} = this.props;
        return (<AppContext.Provider value={{store, getComponent, locale, messages}}>
            {this.props.children}
        </AppContext.Provider>);
    }

}

export default AppContextProvider
