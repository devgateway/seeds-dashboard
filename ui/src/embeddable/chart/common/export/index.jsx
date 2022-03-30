import React, { useEffect, useRef, useState } from "react";
import { Input, Popup, Form, Button } from 'semantic-ui-react'
import './styles.scss';
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { CURRENT_TAB, SELECTED_COUNTRY } from "../../../reducers/StoreConstants";

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
    const GenerateUrlForm = () => {
        let selectedCountry;
        let selectedTab;
        if (filters) {
            if (filters.get(SELECTED_COUNTRY)) {
                selectedCountry = filters.get(SELECTED_COUNTRY);
            }
            if (filters.get(CURRENT_TAB)) {
                selectedTab = filters.get(CURRENT_TAB);
            }
        }

        let finalUrl = `${url}#tab=${selectedTab}/chart=${chartType}/country=${selectedCountry}`
        if (selectedCrops && selectedCrops.length > 0) {
            finalUrl = finalUrl + `/crops=${selectedCrops.join(",")}`;
        }
        if (selectedYear && selectedYear.length > 0) {
            finalUrl = finalUrl + `/years=${Array.isArray(selectedYear) ? selectedYear.join(",") : selectedYear}`;
        }
        const clipboardMessage = intl.formatMessage({
            id: 'text-to-clipboard',
            defaultMessage: 'text copied to clipboard'
        });
        const ref = useRef(null);
        const onHoverOutsideRef = () => {
            setIsPopupOpen(false)
        }
        useEffect(() => {
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
            return () => {
                document.removeEventListener('mouseout', hoverOutside, true);
            };
        }, []);
        return (<div ref={ref}><Form.Group grouped>
            <Input key="search_input" type="text" iconPosition='left'
                   value={finalUrl} style={{ width: '500px' }} />
            <Popup on={"click"} content={clipboardMessage} closeOnTriggerClick={true}
                   trigger={<Button onClick={() => {
                       navigator.clipboard.writeText(finalUrl);
                       setTimeout(() => {
                           setIsPopupOpen(false)
                       }, 2000);

                   }}>Share</Button>} />

        </Form.Group></div>)
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
                       trigger={<div className="export share tooltip" />}
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
