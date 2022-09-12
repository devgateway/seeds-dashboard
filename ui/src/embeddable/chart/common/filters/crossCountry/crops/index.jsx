import React, { useState, useEffect, useRef } from "react";
import './styles.scss';
import { Accordion, Form, Menu } from "semantic-ui-react";
import { normalizeField } from "../../../../../utils/common";

const CrossCountryCropFilter = ({ data, onChange, initialSelectedCrop = 0, intl }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedCrop, setSelectedCrop] = useState(0);
    const [currentData, setCurrentData] = useState(null);

    const ref = useRef(null);

    if (data !== currentData) {
        setCurrentData(data);
        setSelectedCrop(initialSelectedCrop);
        setIsOpen(false);
    }

    const handleClick = (e, titleProps) => {
        setIsOpen(!isOpen);
    }

    const onClickOutside = () => {
        setIsOpen(false);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClickOutside && onClickOutside();
            }
        };
        document.addEventListener('mouseout', handleClickOutside, true);
        return () => {
            document.removeEventListener('mouseout', handleClickOutside, true);
        };
    }, [onClickOutside]);

    const handleChange = (e, props) => {
        const index = data.findIndex(i => i === props.value);
        setSelectedCrop(index);
        onChange(index);
    }

    const generateContent = () => {
        return (data.map((c, i) => {
            return (<div key={c}>
                <Form.Checkbox value={c} checked={selectedCrop === i} onChange={handleChange}
                               label={intl.formatMessage({ id: c, defaultMessage: c })} />
            </div>);
        }));
    }

    const sum = selectedCrop !== null ? 1 : 0;
    let currentDataLabel = '';
    if (currentData && currentData[selectedCrop]) {
        currentDataLabel = intl.formatMessage({
            id: normalizeField(currentData[selectedCrop]),
            defaultMessage: currentData[selectedCrop]
        })
    }
    const title = (<div><span className="filter-selector-title" style={{ textTransform: 'capitalize' }}>

        {intl.formatMessage({
            id: "crop-legend",
            defaultMessage: "Crop"
        })}: {currentDataLabel}
    </span><span className="filter-selector-numbers">{sum} {intl.formatMessage({
        id: "of",
        defaultMessage: "of"
    })} {currentData ? currentData.length : 0}</span></div>);
    return (
        <div ref={ref}>
            <Accordion as={Menu} vertical>
                <Menu.Item>
                    <Accordion.Title
                        active={isOpen}
                        content={title}
                        icon="angle right"
                        index={0}
                        onClick={handleClick}
                    />
                    <Accordion.Content className="ignore" active={isOpen} content={generateContent()} />
                </Menu.Item>
            </Accordion>
        </div>
    )
}

export default CrossCountryCropFilter
