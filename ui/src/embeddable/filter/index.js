import React, {useEffect} from "react";
import {Container} from "semantic-ui-react";
import {connect} from "react-redux";
import {getCategories, setFilter} from "../../data/module";
import {DropDownFilter} from './Components'
import './filter.scss'

const Filter = ({
                    onApply,
                    "data-type": type = 'Crop',
                    "data-param": param,
                    "data-placeholder": placeholder,
                    "data-multi": multi,
                    categories,
                    onLoadCategories
                }) => {
    useEffect(() => {
        onLoadCategories()
    }, [])
    if (categories) {


    }
    return <div className={"chart-filter"}>
        <DropDownFilter placeholder={placeholder} categories={categories} type={type} multi={multi} onChange={(e, {value}) => {
            onApply(param, value)
        }}></DropDownFilter>
    </div>
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

export default connect(mapStateToProps, mapActionCreators)(Filter)
