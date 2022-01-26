import React, {useState} from "react";
import './styles.scss';
import {Accordion, Form, Menu} from "semantic-ui-react";

const Years = ({data, onChange, isMulti}) => {

    const [activeIndex, setActiveIndex] = useState([0]);
    const [selectedYear, setSelectedYear] = useState([1]);
    const [currentData, setCurrentData] = useState(null);

    if (data !== currentData) {
        setCurrentData(data);
        let yearsSelected = data[data.length - 1];
        if (isMulti) {
            yearsSelected = Array.apply(null, Array(data.length)).map(function () { return 1; });
        }
        setSelectedYear(yearsSelected);
        setActiveIndex([0]);
    }

    const handleClick = (e, titleProps) => {
        const {index} = titleProps
        setActiveIndex(activeIndex === index ? -1 : index);
    }

    const handleChange = (e, props) => {
        if (isMulti) {
            const currentlySelected = Object.assign([], selectedYear);
            const index = data.findIndex(i => i === props.value);
            currentlySelected[index] = currentlySelected[index] === 0 ? 1 : 0;
            setSelectedYear(currentlySelected);
            onChange(currentlySelected);
        } else {
            setSelectedYear(props.value);
            onChange(props.value);
        }
    }

    const generateContent = () => {
        if (isMulti) {
            return (data.map((c, i) => {
                return (<div key={c}>
                    <Form.Checkbox value={c} checked={selectedYear[i] === 1} onChange={handleChange} label={c}/>
                </div>);
            }));
        } else {
            return (data.map((c) => {
                return (<div key={c}>
                    <Form.Radio value={c} checked={selectedYear === c} onChange={handleChange} label={c}/>
                </div>);
            }));
        }
    }

    const title = (<div><span className="filter-selector-title">Year </span><span
        className="filter-selector-numbers">1 of {data.length}</span></div>);
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
