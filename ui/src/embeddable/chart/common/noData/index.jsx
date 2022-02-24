import React from "react";
import './styles.scss';
import {injectIntl} from "react-intl";

const NoData = ({text, intl}) => {
    return (
        <h2 className={'no-data'}>{text ? text : intl.formatMessage({
            id: 'no-data',
            defaultMessage: 'No Data Available'
        })}</h2>
    )
}

export default injectIntl(NoData);
