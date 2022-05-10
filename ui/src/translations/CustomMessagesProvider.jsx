import React from 'react'
import { CUSTOM_TOOLTIPS } from "../embeddable/reducers/StoreConstants";
import { connect } from "react-redux";

const SUPPORTED_LOCALES = ['en', 'fr'];
export const CustomMessageContext = React.createContext()

const CustomMessagesProvider = ({ children, custom_tooltips, messagesArray, locale }) => {
    if (custom_tooltips && custom_tooltips.length > 0) {
        custom_tooltips.forEach(ct => {
            SUPPORTED_LOCALES.forEach(sl => {

                if (ct.message[sl]) {
                    messagesArray[sl][`tooltip-${ct.key}`] = ct.message[sl];
                }
            })
        });
    }
    return (<CustomMessageContext.Provider value={{ messages: messagesArray[locale] }}>
        {children}
    </CustomMessageContext.Provider>);
}
const mapStateToProps = (state) => {
    return {
        custom_tooltips: state.getIn(['data', CUSTOM_TOOLTIPS, 'load', 'data'])
    }
}
export default connect(mapStateToProps, {})(CustomMessagesProvider);