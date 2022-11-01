import React, {useState, useEffect, useRef} from "react";
import './styles.scss';
import {Accordion, Form, Menu} from "semantic-ui-react";
import {getSortedAndTranslatedArray} from "../FilterCommons";

const CropFilter = ({data, onChange, initialSelectedCrops = [1, 1, 1, 1], intl, maxSelectable, firstAtFront}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [numberOfSelectedCrops, setNumberOfSelectedCrops] = useState([1, 1, 1, 1]);
    const [currentData, setCurrentData] = useState(null);

    const ref = useRef(null);

    if (data !== currentData) {
        setCurrentData(data);
        setNumberOfSelectedCrops(initialSelectedCrops);
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
        if (maxSelectable && maxSelectable === 1) { // Only 1 maxSelectable for now.
            const currentlySelected = [];
            const index = data.findIndex(i => i === props.value);
            numberOfSelectedCrops.forEach(i => {
                currentlySelected.push(0);
            });
            currentlySelected[index] = 1;
            setNumberOfSelectedCrops(currentlySelected);
            onChange(currentlySelected);
        } else {
            const currentlySelected = Object.assign([], numberOfSelectedCrops);
            const index = data.findIndex(i => i === props.value);
            currentlySelected[index] = currentlySelected[index] === 0 ? 1 : 0;
            setNumberOfSelectedCrops(currentlySelected);
            onChange(currentlySelected);
        }
    }

    const generateContent = () => {

        return (getSortedAndTranslatedArray(data, intl, firstAtFront).map((c, i) => {
            return (<div key={c.value}>
                {maxSelectable !== 1 ?
                    <Form.Checkbox value={c.value} checked={numberOfSelectedCrops[i] === 1} onChange={handleChange}
                                   label={c.translatedLabel}/> :
                    <Form.Radio value={c.value} checked={numberOfSelectedCrops[i] === 1} onChange={handleChange}
                                label={c.translatedLabel}/>}
            </div>);
        }));
    }

    let title;
    if (maxSelectable !== 1) {
        const sum = numberOfSelectedCrops.reduce((acc, a) => acc + a, 0);
        title = (<div><span className="filter-selector-title">{intl.formatMessage({
            id: "crop-s",
            defaultMessage: "Crop(s)"
        })}</span><span
            className="filter-selector-numbers">{sum} {intl.formatMessage({
            id: 'of',
            defaultMessage: 'of'
        })} {currentData ? currentData.length : 0}</span></div>);
    } else {
        const index = numberOfSelectedCrops.findIndex(i => i === 1);
        title = (data && data[index] ? <div>
            <span className="filter-selector-title">{intl.formatMessage({
                id: "crop-s",
                defaultMessage: "Crop(s)"
            })}</span>
            {data && index >= 0 &&
                <span className="filter-selector-numbers">{intl.formatMessage({id: data[index]})}</span>}
        </div> : null);
    }
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

export default CropFilter
