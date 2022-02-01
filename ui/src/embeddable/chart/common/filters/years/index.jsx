import React, {useState} from "react";
import './styles.scss';
import {Accordion, Form, Menu} from "semantic-ui-react";

const Years = ({data, onChange, maxSelectable, defaultSelected}) => {

    const [activeIndex, setActiveIndex] = useState([0]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [currentData, setCurrentData] = useState(null);

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
        setActiveIndex([0]);
    }

    const handleClick = (e, titleProps) => {
        const {index} = titleProps
        setActiveIndex(activeIndex === index ? -1 : index);
    }

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
            return (data.map((c, i) => {
                return (<div key={c}>
                    <Form.Checkbox value={c} checked={selectedYear && selectedYear.find(j => j === c)}
                                   onChange={handleChange}
                                   label={c}/>
                </div>);
            }));
        }
    }

    const title = (<div><span className="filter-selector-title">Year </span><span
        className="filter-selector-numbers">{selectedYear ? selectedYear.length : 0} of {data.length}</span></div>);
    return (
        <Accordion as={Menu} vertical>
            <Menu.Item>
                <Accordion.Title
                    active={activeIndex === 0}
                    content={title}
                    icon="angle right"
                    index={0}
                    onClick={handleClick}
                />
                <Accordion.Content active={activeIndex === 0} content={generateContent()}/>
            </Menu.Item>
        </Accordion>
    )
}

export default Years
