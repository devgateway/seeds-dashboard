import React, {useState} from "react";
import './styles.scss';
import {Accordion, Form, Menu} from "semantic-ui-react";

const Years = ({data, onChange}) => {

    const [activeIndex, setActiveIndex] = useState([0]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [currentData, setCurrentData] = useState(null);

    if (data !== currentData) {
        setCurrentData(data);
        setSelectedYear(data[data.length - 1]);
        setActiveIndex([0]);
    }

    const handleClick = (e, titleProps) => {
        const {index} = titleProps
        setActiveIndex(activeIndex === index ? -1 : index);
    }

    const handleChange = (e, props) => {
        setSelectedYear(props.value);
        onChange(props.value);
    }

    const generateContent = () => {
        return (data.map((c) => {
            debugger
            return (<div key={c}>
                <Form.Radio value={c} checked={selectedYear === c} onChange={handleChange} label={c}/>
            </div>);
        }));
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
