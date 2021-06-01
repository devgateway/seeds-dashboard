import React, {useEffect} from "react";
import {connect} from "react-redux";
import {getCategories, setFilter} from "../../data/module";
import {DropDownFilter} from './Components'
import './filter.scss'

const Filter = ({
                    onApply,
                    "data-type": type = 'cropId',
                    "data-param": param,
                    "data-placeholder": placeholder,
                    "data-multi": multi,
                    selected,
                    categories,
                    onLoadCategories
                }) => {
    useEffect(() => {
        onLoadCategories()
    }, [])
    if (categories) {


    }
    return <div className={"chart-filter"}>
        <DropDownFilter placeholder={placeholder} categories={categories} selected={param} type={type} multi={multi} onChange={(e, {value}) => {
            onApply(type, value)
        }}></DropDownFilter>
    </div>
}

const mapStateToProps = (state, ownProps) => {
    return {
        categories: state.getIn(['data', 'categories']),
        selected: state.getIn(['data', 'filters'])
    }
}

const mapActionCreators = {
    onApply: setFilter,
    onLoadCategories: getCategories
};

export default connect(mapStateToProps, mapActionCreators)(Filter)
