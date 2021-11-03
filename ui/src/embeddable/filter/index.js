import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import { connect } from "react-redux";
import { getCategories, setFilter } from "../reducers/data";
import { CountryFilter } from './Components'
import './filter.scss'

const Filter = ({
                  onApply, "data-type": type = 'AgeGroup', categories, onLoadCategories
                }) => {
  /*useEffect(() => {
    onLoadCategories()
  }, [])*/
  /*TODO to be complented in SEEDSDT-170*/
  /*return <Container fluid={true} className={"filter"}>
    <CountryFilter type={type} onChange={(e, { value }) => {
      onApply(param, value)
    }}></CountryFilter>

  </Container>*/
  return <Container fluid={true} className={"filters"}><CountryFilter /></Container>
}

const mapStateToProps = (state, ownProps) => {
  return {
    categories: state.getIn(['data', 'categories'])
  }
}

const mapActionCreators = {
  onApply: setFilter,
  onLoadCategories: getCategories
};

//export default connect(mapStateToProps, mapActionCreators)(Filter)
export default Filter;