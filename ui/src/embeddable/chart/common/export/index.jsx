import React, { useEffect, useRef, useState } from "react";
import { Input, Popup, Form, Button, Icon } from 'semantic-ui-react'
import './styles.scss';
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { CURRENT_TAB } from "../../../reducers/StoreConstants";
import { SELECTED_COUNTRY } from "../../../../seeds-commons/commonConstants";
import {generateShareParams} from "../../../utils/common";

const Export = ({
                    methodology,
                    download,
                    exportPng,
                    containerRef,
                    type,
                    filters,
                    chartType,
                    selectedCrops,
                    selectedYear,
                    intl
                }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [hoveredOnce, setHoveredOnce] = useState(false);
    const indexOfHash = window.location.href.indexOf("#");
    let url = window.location.href;
    if (indexOfHash > 0) {
        url = url.substring(0, indexOfHash);
    }
    const buttonRef = useRef(null);
    const GenerateUrlForm = () => {
        let finalUrl = url + generateShareParams(filters, chartType, selectedCrops, selectedYear);
        const clipboardMessage = intl.formatMessage({
            id: 'text-to-clipboard',
            defaultMessage: 'text copied to clipboard'
        });
        const ref = useRef(null);
        const onHoverOutsideRef = () => {
            setIsPopupOpen(false)
        }
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (ref.current && !ref.current.contains(event.target) && buttonRef.current
                    && !buttonRef.current.contains(event.target)) {
                    onHoverOutsideRef();
                }
            }
            const hoverOutside = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    if (hoveredOnce) {
                        onHoverOutsideRef();
                        setHoveredOnce(!hoveredOnce);
                    }
                } else {
                    setHoveredOnce(!hoveredOnce);
                }
            };
            document.addEventListener('mouseout', hoverOutside, true);
            document.addEventListener("click", handleClickOutside, false);
            return () => {
                debugger
                document.removeEventListener('mouseout', hoverOutside, true);
                document.removeEventListener("click", handleClickOutside, true);
            };
        }, []);
        return (<div ref={ref}>
            <Icon.Group>
                <Icon name='circle outline' />
                <Icon name='delete' size='tiny' link onClick={() => onHoverOutsideRef()} />
            </Icon.Group>
            <Form.Group grouped>
                <Input key="search_input" type="text" iconPosition='left'
                       value={finalUrl} style={{ width: '500px' }} />
                <Popup on={"click"} content={clipboardMessage} closeOnTriggerClick={true}
                       trigger={<Button onClick={() => {
                           navigator.clipboard.writeText(finalUrl);
                           setTimeout(() => {
                               setIsPopupOpen(false)
                           }, 2000);

                       }}>Share</Button>} />

            </Form.Group>
        </div>)
    }
    return (
        <div className="export-wrapper">
            <div className="export-buttons">
                {download === 'true'
                    ? <div className="export download" onClick={e => exportPng(containerRef, type)} />
                    : null}
                <Popup className="url-popup" content={<GenerateUrlForm />}
                       on={"click"}
                       open={isPopupOpen}
                       onOpen={e => {
                           setIsPopupOpen(true)
                       }}
                       trigger={<div className="export share tooltip" ref={buttonRef} />}
                       position='top right' />
            </div>
            {methodology
                ?
                <Popup className="methods-popup" content={methodology} trigger={<div className="tooltip">Methods</div>}
                       position='bottom right' />
                : null}
        </div>
    )

}

const mapStateToProps = (state) => {
    return { filters: state.getIn(['data', 'filters']), }
}
const mapActionCreators = {}
export default connect(mapStateToProps, mapActionCreators)(injectIntl(Export))
