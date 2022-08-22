import { injectIntl } from "react-intl";
import { Button, Checkbox, Form, Icon, Input, Label, Popup, Radio, Select, TextArea } from "semantic-ui-react";
import React, { useEffect, useRef, useState } from "react";
import './Tooltip.scss';
import messages_en from "../../../translations/en.json";
import messages_fr from "../../../translations/fr.json";
import { CUSTOM_TOOLTIPS } from "../../reducers/StoreConstants";
import { connect } from "react-redux";
import { getIndicatorsInformation, storeTooltips } from "../../reducers/data";
import TooltipEditForm from "./TooltipEditForm";

const Tooltip = ({ item, intl, tiny, editing }) => {
    const EMPTY = 'EMPTY';
    const key = `tooltip-${item.key}`;
    const test = intl.formatMessage({ id: key, defaultMessage: EMPTY });
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    if (test === EMPTY && !editing) {
        return null;
    }

    if (editing) {
        return <Popup
            trigger={<Icon circular size={tiny ? 'tiny' : 'small'} name='info' />}
            on={'hover'}
            className="edit-indicator-popup"
            position="right center"
            content={() => {
                return <TooltipEditForm tooltipKey={item.key} setIsPopupOpen={setIsPopupOpen}
                                        isPopupOpen={isPopupOpen} />;
            }}
            open={isPopupOpen}
            onOpen={e => {
                setIsPopupOpen(true)
            }}
        />
    } else {
        return <Popup
            trigger={<Icon circular size={tiny ? 'tiny' : 'small'} name='info' />}
            className="indicator-popup"
            position="right center">
            {intl.formatMessage({
                id: key,
                defaultMessage: 'Missing key' + item.key
            })}
        </Popup>
    }
}

const mapStateToProps = (state) => {
    return {
        custom_tooltips: state.getIn(['data', CUSTOM_TOOLTIPS, 'load', 'data'])
    }
}
const mapActionCreators = {};

export default connect(mapStateToProps, mapActionCreators)(injectIntl(Tooltip))

