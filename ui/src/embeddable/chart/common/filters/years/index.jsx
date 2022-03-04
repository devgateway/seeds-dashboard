import React, {useEffect, useRef, useState} from "react";
import './styles.scss';
import {Accordion, Form, Menu} from "semantic-ui-react";

const YearsFilter = ({data, onChange, maxSelectable, defaultSelected, showMaxYearsMessage = false}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);
    const [currentData, setCurrentData] = useState(null);

    const ref = useRef(null);

    if (data !== currentData) {
        setCurrentData(data);
        if (defaultSelected) {
            setSelectedYear(defaultSelected);
        } else {
            if (maxSelectable) {
                setSelectedYear(data.slice(0, maxSelectable));
            } else {
                setSelectedYear(data[data.length - 1]);
            }
        }
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
        if (maxSelectable === 1) {
            setSelectedYear([props.value]);
            onChange(props.value);
        } else {
            const index = selectedYear.findIndex(i => i === props.value);
            let auxArray = Object.assign([], selectedYear);
            if (index >= 0) {
                auxArray.splice(index, 1);
                setSelectedYear(auxArray);
            } else {
                if (auxArray.length === maxSelectable) {
                    auxArray.shift();
                }
                auxArray.push(props.value);
                auxArray = auxArray.sort();
                setSelectedYear(auxArray);
            }
            onChange(auxArray)
        }
    }

    const generateContent = () => {
        if (!maxSelectable) {
            return 'set maxSelectable param first.';
        }
        if (maxSelectable === 1) {
            return (data.map((c) => {
                return (<div key={c}>
                    <Form.Radio value={c} checked={selectedYear && selectedYear[0] === c}
                                onChange={handleChange} label={c}/>
                </div>);
            }));
        } else {
            return (<>
                {showMaxYearsMessage && data.length > maxSelectable ?
                    <div className="max-years-msg">Select Three Years Maximum</div> : null}
                {data.map((c, i) => {
                    return (<div key={c}>
                        <Form.Checkbox value={c}
                                       checked={(selectedYear && selectedYear.find(j => j === c)) ? true : false}
                                       onChange={handleChange}
                                       label={c}/>
                    </div>);
                })}</>);
        }
    }

    const title = (<div><span className="filter-selector-title">Year </span><span
        className="filter-selector-numbers">{selectedYear ? selectedYear.length : 0} of {data.length}</span></div>);
    return (
        <div ref={ref}>
            <Accordion as={Menu} vertical>
                <Menu.Item>
                    <Accordion.Title
                        active={isOpen}
                        content={title}
                        icon="angle right"
                        index={1}
                        onClick={handleClick}
                    />
                    <Accordion.Content className="ignore" active={isOpen} content={generateContent()}/>
                </Menu.Item>
            </Accordion>
        </div>
    )
}

export default YearsFilter
