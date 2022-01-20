import React, {useState} from "react";
import './styles.scss';
import {Accordion, Form, Menu} from "semantic-ui-react";

const CropsLegend = ({data, onChange}) => {

    const [activeIndex, setActiveIndex] = useState([0]);
    const [numberOfSelectedCrops, setNumberOfSelectedCrops] = useState([1, 1, 1, 1]);
    const [currentData, setCurrentData] = useState(null);

    if (data !== currentData) {
        setCurrentData(data);
        setNumberOfSelectedCrops([1, 1, 1, 1]);
        setActiveIndex([0]);
    }

    const handleClick = (e, titleProps) => {
        const {index} = titleProps
        setActiveIndex(activeIndex === index ? -1 : index);
    }

    const handleChange = (e, props) => {
        const currentlySelected = Object.assign([], numberOfSelectedCrops);
        const index = data.findIndex(i => i === props.value);
        currentlySelected[index] = currentlySelected[index] === 0 ? 1 : 0;
        setNumberOfSelectedCrops(currentlySelected);
        onChange(currentlySelected);
    }

    const generateContent = () => {
        return (data.map((c, i) => {
            return (<div key={c}>
                <Form.Checkbox value={c} checked={numberOfSelectedCrops[i] === 1} onChange={handleChange} label={c}/>
            </div>);
        }));
    }

    const sum = numberOfSelectedCrops.reduce((acc, a) => acc + a, 0);
    const title = (<div><span className="filter-selector-title">Crop(s) </span><span
        className="filter-selector-numbers">{sum} of 4</span></div>);
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

export default CropsLegend
