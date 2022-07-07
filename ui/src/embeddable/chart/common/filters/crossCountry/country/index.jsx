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
        const index = currentData.findIndex(i => i.iso === props.value);
        const selected = currentData.find(i=>i.iso === props.value).selected
        onChange(index, props.value, !selected);
    }
    
    const selectAll = () => {
        currentData.forEach((i, index) => {
            if (i.active) {
                onChange(index, i.iso, true)
            }
        });
    }

    const selectNone = () => {
        currentData.forEach((i, index) => {
            if (i.active) {
                onChange(index, i.iso, false)
            }
        });
    }

    const generateContent = () => {
        if (currentData) {
            const aux = JSON.parse(JSON.stringify(currentData)).sort((a, b) => a.name.localeCompare(b.name));
            return (
                <>
                    <div className="cross_country_select">
                        <span onClick={selectAll}>{intl.formatMessage({id: 'select-all'})} </span> | <span onClick={selectNone}> {intl.formatMessage({id: 'select-none'})}</span>
                    </div>
                    {aux.map((c, i) => {
                        return (<div key={c} style={{width: "50%", position: "relative", display: "inline-block"}}>
                            <Form.Checkbox value={c.iso} checked={c.selected}
                                           onChange={handleChange}
                                           disabled={!c.active}
                                           label={intl.formatMessage({id: c.name, defaultMessage: c.name})}/>
                        </div>);
                    })}
                </>);
        }
        return null;
    }

    const sum = currentData ? currentData.filter(i => i.selected).length : 0;
    const title = (<div><span className="filter-selector-title">Country </span><span
        className="filter-selector-numbers">{sum} of {currentData ? currentData.length : 0}</span></div>);
    return (
        <div ref={ref}>
            <Accordion as={Menu} vertical style={{width: "100%"}}>
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
