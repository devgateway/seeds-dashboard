import React, { useEffect, useRef, useState } from "react";
import messages_en from "../../../translations/en.json";
import messages_fr from "../../../translations/fr.json";
import { Button, Form, Message, TextArea } from "semantic-ui-react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { CUSTOM_TOOLTIPS } from "../../reducers/StoreConstants";
import { messageShown, storeTooltips } from "../../reducers/data";

const TooltipEditForm = ({
                             tooltipKey,
                             onStoreTooltips,
                             setIsPopupOpen,
                             isPopupOpen,

                             onMessageShown,
                             saving,
                             error,
                             saved
                         }) => {
    const key = `tooltip-${tooltipKey}`
    const ref = useRef(null);
    const [state, setState] = useState({});
    const [hoveredOnce, setHoveredOnce] = useState(false);
    const handleInnerClick = (e) => {
        e.stopPropagation();
    }
    const onClose = () => {
        onMessageShown();
        setIsPopupOpen(false);
    }
    useEffect(() => {
        if (!saving && !error && saved && isPopupOpen) {
            onClose();
            messages_en[`tooltip-${tooltipKey}`] = state.valueEn;
            messages_fr[`tooltip-${tooltipKey}`] = state.valueFr;
        }
    }, [saving, error, saved]);

    useEffect(() => {
        if (tooltipKey) {
            if (messages_en && messages_en[key]) {
                setState(prevState => ({ ...prevState, valueEn: messages_en[key] }));
            }
            if (messages_fr && messages_fr[key]) {
                setState(prevState => ({ ...prevState, valueFr: messages_fr[key] }));
            }
        }
        const hoverOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                if (hoveredOnce) {
                    setHoveredOnce(false);
                    setIsPopupOpen(false);
                }
            } else {
                setHoveredOnce(true);
            }
        };

        document.addEventListener('mouseout', hoverOutside, true);
        document.addEventListener("click", handleInnerClick, false);
        return () => {
            document.removeEventListener("click", handleInnerClick, false);
            document.removeEventListener('mouseout', hoverOutside, true);
        };

    }, [tooltipKey]);
    const handleChange = (e, { name, value }) => {
        setState(prevState => ({ ...prevState, [name]: value }));
    }
    return <div ref={ref} onClick={handleInnerClick}>
        {error && <Message
            attached
            content={error}
        />}
        <Form>
            <Form.Field>
                <label>EN</label>
                <TextArea value={state.valueEn} onChange={handleChange} name={'valueEn'} />
            </Form.Field>
            <Form.Field>
                <label>FR</label>
                <TextArea value={state.valueFr} onChange={handleChange} name={'valueFr'}
                          style={{ 'width': '500px' }} />
            </Form.Field>
            <Form.Group inline>
                <Button onClick={() => {
                    const theMessage = {};
                    theMessage.key = tooltipKey;
                    theMessage.en = state.valueEn;
                    theMessage.fr = state.valueFr;
                    onStoreTooltips(theMessage);
                }
                }>Save</Button>
                <Button onClick={onClose}>Cancel</Button>
            </Form.Group>
        </Form>
    </div>
}
const mapStateToProps = (state) => {
    return {
        saving: state.getIn(['data', CUSTOM_TOOLTIPS, 'store', 'saving']),
        error: state.getIn(['data', CUSTOM_TOOLTIPS, 'store', 'error']),
        saved: state.getIn(['data', CUSTOM_TOOLTIPS, 'store', 'saved']),
    }
}
const mapActionCreators = {
    onStoreTooltips: storeTooltips,
    onMessageShown: messageShown
};
export default connect(mapStateToProps, mapActionCreators)(injectIntl(TooltipEditForm));