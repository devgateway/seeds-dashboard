import { injectIntl } from "react-intl";
import { Icon, Popup } from "semantic-ui-react";
import React from "react";

const Tooltip = ({ item, intl, tiny }) => {
  return <Popup
    trigger={<Icon circular size={tiny ? 'tiny' : 'small'} name='info' />}
    className="indicator-popup"
    position="right center">
    {intl.formatMessage({
      id: `tooltip-${item.key}`,
      defaultMessage: 'Missing key' + item.key
    })}
  </Popup>
}
export default injectIntl(Tooltip);