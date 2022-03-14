import { Accordion, Form, Grid, Icon, Input, Menu } from "semantic-ui-react";
import React, { useState } from "react";
import { SELECTED_COUNTRY } from "../../reducers/StoreConstants";
import { injectIntl } from "react-intl";

const CountrySelector = ({
                             countries,
                             filters,
                             onApply,
                             selectedCountryFirst,
                             addYear,
                             selectedCountryLabel,
                             countryColumns,
                             intl,
                             isShowSelector,
                             selectedCountryPostLabel
                         }) => {
    const [activeIndex, setActiveIndex] = useState([0]);
    const [searchKeyword, setSearchKeyword] = useState(undefined);
    const handleSelectedCountry = (event, { value }) => {
        setActiveIndex(undefined);
        setSearchKeyword(undefined);
        onApply(SELECTED_COUNTRY, value);
    }
    const getSelectedCountry = () => {
        if (filters && filters.get(SELECTED_COUNTRY)) {
            if (countries) {
                const selectedCountry = countries.find(c => c.countryId === filters.get(SELECTED_COUNTRY));
                return `${selectedCountry.country} ${addYear ? ' ' + selectedCountry.year : ''}`;
            }
        }
    }

    const handleSearch = (event, { value }) => {
        setSearchKeyword(value);
    }
    const generateCountries = () => {
        return countries && countries.filter(c => {
            if (searchKeyword) {
                let ret = true;
                const searchArray = searchKeyword.toLowerCase().trim().split(' ').filter(i => i !== '');
                searchArray.forEach(i => {
                    if (!c.country.toLowerCase().includes(i) && !c.year.toString().includes(i)) {
                        ret = false;
                    }
                });
                return ret;
            }
            return true;
        }).map(c => {
            const checked = filters && c.countryId === filters.get(SELECTED_COUNTRY);
            return <Grid.Column key={c.countryId}><Form.Radio
                key={c.countryId}
                checked={checked}
                className={`${checked ? 'checked' : ''}`}
                label={`${c.country}${addYear ? ' ' + c.year : ''}`} name='size' type='radio' value={c.countryId}
                onClick={handleSelectedCountry}
            /></Grid.Column>;
        });
    }

    const CountryForm = (
        <Form>
            <Form.Group grouped>
                <Input key="search_input" type="text" icon='search' iconPosition='left'
                       placeholder="Search..." onChange={handleSearch}
                       value={searchKeyword}
                />
                <Icon.Group>
                    <Icon name='circle outline' />
                    <Icon name='delete' size='tiny' link onClick={() => setSearchKeyword('')} />
                </Icon.Group>
            </Form.Group>
            <Grid columns={countryColumns}>
                {generateCountries()}
            </Grid>
        </Form>
    )
    const handleClick = (e, titleProps) => {
        const { index } = titleProps
        setActiveIndex(activeIndex === index ? -1 : index);
    }
    const getSelectedCountryGrids = () => {
        const grids = [];
        if (isShowSelector) {
            grids.push(<Grid.Column width={selectedCountryFirst ? 8 : 10} key={1}>
                <Accordion as={Menu} vertical className={!selectedCountryFirst ? 'narrow' : ''}>
                    <Menu.Item>
                        <Accordion.Title
                            active={activeIndex === 0}
                            content='Select another country'
                            icon="angle right"
                            index={0}
                            onClick={handleClick}
                        />
                        <Accordion.Content active={activeIndex === 0} content={CountryForm} />
                    </Menu.Item>
                </Accordion>
            </Grid.Column>);
        }
        grids.push(
            <Grid.Column key={2} width={selectedCountryFirst ? 8 : 6}
                         className="selected-country">{selectedCountryLabel &&
                <span>{selectedCountryLabel}</span>}{getSelectedCountry()}{selectedCountryPostLabel &&
                <span>{selectedCountryPostLabel}</span>}</Grid.Column>)

        if (selectedCountryFirst) {
            return grids.reverse();
        } else {
            return grids;
        }
    }
    return (<Grid className={"select-country-grid"}>
        {getSelectedCountryGrids()}

    </Grid>);
}

export default CountrySelector;
