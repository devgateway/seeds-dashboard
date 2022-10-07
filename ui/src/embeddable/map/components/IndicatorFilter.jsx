import React, {useState, useEffect, useRef} from "react";
import './IndicatorFilter.scss';
import {Accordion, Form, Menu} from "semantic-ui-react";

const IndicatorFilter = ({data, onChange, initialSelectedIndicator, intl}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [currentData, setCurrentData] = useState(null);

    const ref = useRef(null);

    if (data !== currentData) {
        setCurrentData(data);
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
        const index = data.findIndex(i => i.value === props.value);
        const currentlySelected = Object.assign({}, data[index]);
        initialSelectedIndicator = currentlySelected
        onChange(currentlySelected);
    }

    const generateContent = () => {
        return (data.map((c, i) => {
            return (<div key={c.id}>
                <Form.Radio value={c.value} onChange={handleChange} checked={c.id === initialSelectedIndicator.id}
                               label={intl.formatMessage({id: c.value, defaultMessage: c.value})}/>
            </div>);
        }));
    }

    const title = (<div>
        <span className="filter-selector-title">{intl.formatMessage({id: "opinion-indicator", defaultMessage: "Opinion Indicator"})}</span>
        <span className="filter-selected-option">{initialSelectedIndicator.value}</span>
    </div>);
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
                    <Accordion.Content className="ignore" active={isOpen} content={generateContent()}/>
                </Menu.Item>
            </Accordion>
        </div>
    )
}

export default IndicatorFilter
