import React, {useState, useEffect, useRef} from "react";
import './styles.scss';
import {Accordion, Form, Menu} from "semantic-ui-react";

const CrossCountryCountryFilter = ({data, onChange, initialSelectedCrops = [], intl}) => {

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
        /*const currentlySelected = Object.assign([], numberOfSelectedCrops);
        const index = data.findIndex(i => i === props.value);
        currentlySelected[index] = currentlySelected[index] === 0 ? 1 : 0;
        setNumberOfSelectedCrops(currentlySelected);
        onChange(currentlySelected);*/
    }

    const generateContent = () => {
        return (data.map((c, i) => {
            return (<div key={c}>
                <Form.Checkbox value={c.iso} checked={c.selected} 
                               onChange={handleChange}
                               disabled={!c.active}
                               label={intl.formatMessage({id: c.name, defaultMessage: c.name})}/>
            </div>);
        }));
    }

    const sum = currentData ? currentData.filter(i => i.selected).length : 0;
    const title = (<div><span className="filter-selector-title">Countries </span><span
        className="filter-selector-numbers">{sum} of {currentData ? currentData.length : 0}</span></div>);
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

export default CrossCountryCountryFilter
