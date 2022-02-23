import {injectIntl} from "react-intl";
import {Icon, Popup} from "semantic-ui-react";
import React from "react";

const Tooltip = ({item, intl, tiny}) => {
    const EMPTY = 'EMPTY';
    const key = `tooltip-${item.key}`;
    const test = intl.formatMessage({id: key, defaultMessage: EMPTY});
    if (test === EMPTY) {
        return null;
    }
    return <Popup
        trigger={<Icon circular size={tiny ? 'tiny' : 'small'} name='info'/>}
        className="indicator-popup"
        position="right center">
        {intl.formatMessage({
            id: key,
            defaultMessage: 'Missing key' + item.key
        })}
    </Popup>
}
export default injectIntl(Tooltip);
