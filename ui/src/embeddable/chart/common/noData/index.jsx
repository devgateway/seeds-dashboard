import React from "react";
import './styles.scss';
import {injectIntl} from "react-intl";

const NoData = ({text, intl, noDataLabelId = 'no-data'}) => {
    return (
        <h2 className={'no-data'}>{text ? text : intl.formatMessage({
            id: noDataLabelId,
            defaultMessage: 'No Data Available'
        })}</h2>
    )
}

export default injectIntl(NoData);
