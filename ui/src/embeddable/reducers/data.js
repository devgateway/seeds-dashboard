import * as api from './data-api'
import Immutable from 'immutable'
import Papa from 'papaparse'

const LOAD_DATA = 'LOAD_DATA'
const LOAD_DATA_DONE = 'LOAD_DATA_DONE'
const LOAD_DATA_ERROR = 'LOAD_DATA_ERROR'
const LOAD_CATEGORIES = 'LOAD_CATEGORIES'
const LOAD_CATEGORIES_DONE = 'LOAD_CATEGORIES_DONE'
const LOAD_CATEGORIES_ERROR = 'LOAD_CATEGORIES_ERROR'

const SET_FILTER = 'SET_FILTER'
const SET_COUNTRY = 'SET_COUNTRY'

const initialState = Immutable.Map({mode: 'info', country: null})

export const setFilter = (type, value) => (dispatch, getState) => {
    dispatch({type: SET_FILTER, param: type, value})
}

export const setCountry = (value) => (dispatch, getState) => {
    dispatch({type: SET_COUNTRY, value})
}

export const getCategories = () => (dispatch, getState) => {
    dispatch({
        type: LOAD_CATEGORIES
    })
    api.getCategories().then(data => {
        dispatch({
            type: LOAD_CATEGORIES_DONE,
            data
        })
    }).catch(error => {
        dispatch({
            type: LOAD_CATEGORIES_ERROR,
            error
        })
    })
}

export const setData = ({csv, store, params}) => (dispatch, getState) => {
    const filters = getState().get('data').getIn(['filters'])
    if (filters) {
        params = {...params, ...filters.toJS()}
    }
    const data = Papa.parse(csv, {header: true});
    dispatch({type: LOAD_DATA_DONE, store, data})
}

export const getData = ({source, store, params}) => (dispatch, getState) => {
    const filters = getState().get('data').getIn(['filters'])
    if (filters) {
        params = {...params, ...filters.toJS()}
    }
    dispatch({type: LOAD_DATA, params, store})
    api.getData(source, params)
        .then(data => dispatch({type: LOAD_DATA_DONE, store, data}))
        .catch(error => dispatch({type: LOAD_DATA_ERROR, store, error}))
}

export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_DATA: {
            const {store} = action
            return state.deleteIn([...store, 'error']).setIn([...store, 'loading'], true)
        }
        case LOAD_DATA_ERROR: {
            const {error, store} = action
            return state
                .setIn([...store, 'loading'], false)
                .setIn([...store, 'error'], error)
        }
        case LOAD_DATA_DONE: {
            const {data, store} = action
            return state
                .setIn([...store, 'loading'], false)
                .deleteIn([...store, 'error'])
                .setIn([...store, 'data'], data)
        }
        case LOAD_CATEGORIES:
            return state
        case LOAD_CATEGORIES_DONE:
            const {data} = action
            return state.setIn(['categories'], Immutable.fromJS(data))
        case LOAD_CATEGORIES_ERROR:
            return state
        case SET_FILTER: {
            const {param, value} = action
            if (value.length == 0) {
                return state.deleteIn(['filters', param], value)
            }
            return state.setIn(['filters', param], value)
        }
        case SET_COUNTRY: {
            const {value} = action
            if (!value){
                return state.setIn(['country'], null)
            }
            return state.setIn(['country'], value)
        }
        default:
            return state
    }
}
