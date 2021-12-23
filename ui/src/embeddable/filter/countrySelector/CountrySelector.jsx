import { Accordion, Form, Grid, Icon, Input, Menu } from "semantic-ui-react";
import React, { useState } from "react";
import { SELECTED_COUNTRY } from "../../reducers/StoreConstants";

const CountrySelector = ({ countries, filters, onApply, selectedCountryFirst, addYear, selectedCountryLabel }) => {
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
        return `${selectedCountry.country} ${addYear === 'true' ? ' ' + selectedCountry.year : ''}`;
      }
    }
  }

  const handleSearch = (event, { value }) => {
    setSearchKeyword(value);
  }
  const generateCountries = () => {
    return countries && countries.filter(c => {
      return searchKeyword ? c.country.toLowerCase().includes(searchKeyword.toLowerCase()) : true
    }).map(c => {
      const checked = filters && c.countryId === filters.get(SELECTED_COUNTRY);
      return <Grid.Column key={c.countryId}><Form.Radio
        key={c.countryId}
        checked={checked}
        className={`${checked ? 'checked' : ''}`}
        label={`${c.country}${addYear === 'true' ? ' ' + c.year : ''}`} name='size' type='radio' value={c.countryId}
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
      <Grid columns={3}>
        {generateCountries()}
      </Grid>
    </Form>
  )
  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    setActiveIndex(activeIndex === index ? -1 : index);
  }
  const getSelectedCountryGrids = () => {
    const grids = [<Grid.Column width={9} key={1}>
      <Accordion as={Menu} vertical>
        <Menu.Item>
          <Accordion.Title
            active={activeIndex === 0}
            content='Select a country'
            icon="angle right"
            index={0}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 0} content={CountryForm} />
        </Menu.Item>
      </Accordion>
    </Grid.Column>, <Grid.Column key={2} width={7} className="selected-country">{selectedCountryLabel &&
      <span>{selectedCountryLabel}</span>}{getSelectedCountry()}</Grid.Column>];
    if (selectedCountryFirst === 'true') {
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