import React from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import DataContext from './DataContext'
import {Container, Loader, Segment} from "semantic-ui-react";
import {getData, setData} from "../reducers/data";
import {COUNTRY_INFO} from "../reducers/StoreConstants";

class DataProvider extends React.Component {

    componentDidMount() {
        const {app, source, store, params, csv, filters} = this.props
        if (app === "csv") {
            this.props.onSetData({app, csv, store, params})
        } else {
            //TODO create a better way to check if api requires filters
            if ((app === COUNTRY_INFO && filters) || app !== COUNTRY_INFO) {
                this.props.onLoadData({app, source, store, params})
            }
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {filters, app, source, store, params, csv} = this.props

        if (filters !== prevProps.filters || app !== prevProps.app || prevProps.source !== source || csv !== prevProps.csv) {
            if (app === "csv") {
                this.props.onSetData({app, csv, store, params})
            } else {
                //TODO create a better way to check if api requires filters
                if ((app === COUNTRY_INFO && filters) || app !== COUNTRY_INFO) {
                    this.props.onLoadData({app, source, store, params})
                }
            }
        }
    }

    render() {
        const {data, loading, error} = this.props

        if (data) {
            return <DataContext.Provider value={data}>{this.props.children}</DataContext.Provider>
        } else if (error) {
            return <Segment color={"red"}>
                <h1>500</h1>
                <p>Wasn't able to load data</p>
            </Segment>
        } else if (loading) {
            return (<Container>
                <h1>Data Loading</h1>
                <Loader inverted content='Loading'/>
            </Container>)
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    const {store} = ownProps

    return {
        data: state.getIn(['data', ...store, 'data']),
        filters: state.getIn(['data', 'filters']),
        error: state.getIn(['data', ...store, 'error']),
        loading: state.getIn(['data', ...store, 'loading']),
    }
}

const mapActionCreators = {
    onSetData: setData,
    onLoadData: getData
};

export default connect(mapStateToProps, mapActionCreators)(injectIntl(DataProvider));
