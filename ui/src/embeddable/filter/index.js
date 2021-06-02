import React, {useEffect} from "react";
import {connect} from "react-redux";
import {getCategories, setFilter} from "../../data/module";
import {DropDownFilter} from './Components'
import './filter.scss'

const Filter = ({
                    onApply,
                    "data-type": type = 'Crop',
                    "data-filter": filter,
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
    return <div className={"chart-filter"}>
        <DropDownFilter placeholder={placeholder} categories={categories} selDef={param} selected={selected} type={type} multi={multi} onChange={(e, {value}) => {
            onApply(filter, value)
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
