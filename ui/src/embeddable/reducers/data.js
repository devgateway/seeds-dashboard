/*This file needs to be cleaned on scope of */
import * as api from './data-api'
import Immutable from 'immutable'
import Papa from 'papaparse'
import {
  COUNTRIES_FILTER,
  COUNTRY_SETTINGS,
  SUMMARY_INDICATORS,
  SUMMARY_INDICATORS_INFORMATION
} from "./StoreConstants";

const LOAD_DATA = 'LOAD_DATA'
const LOAD_DATA_DONE = 'LOAD_DATA_DONE'
const LOAD_DATA_ERROR = 'LOAD_DATA_ERROR'
const LOAD_COUNTRIES = 'LOAD_COUNTRIES'
const LOAD_COUNTRIES_DONE = 'LOAD_COUNTRIES_DONE'
const LOAD_COUNTRIES_ERROR = 'LOAD_COUNTRIES_ERROR'

const LOAD_INDICATORS = 'LOAD_INDICATORS'
const LOAD_INDICATORS_DONE = 'LOAD_INDICATORS_DONE'
const LOAD_INDICATORS_ERROR = 'LOAD_INDICATORS_ERROR'

const LOAD_INDICATORS_INFORMATION = 'LOAD_INDICATORS_INFORMATION'
const LOAD_INDICATORS_INFORMATION_DONE = 'LOAD_INDICATORS_INFORMATION_DONE'
const LOAD_INDICATORS_INFORMATION_ERROR = 'LOAD_INDICATORS_INFORMATION_ERROR'


const LOAD_COUNTRY_SETTINGS = 'LOAD_COUNTRY_SETTINGS'
const LOAD_COUNTRY_SETTINGS_DONE = 'LOAD_COUNTRY_SETTINGS_DONE'
const LOAD_COUNTRY_SETTINGS_ERROR = 'LOAD_COUNTRY_SETTINGS_ERROR'

const SET_FILTER = 'SET_FILTER'


const initialState = Immutable.Map({ mode: 'info' })


export const setFilter = (type, value) => (dispatch, getState) => {
  dispatch({ type: SET_FILTER, param: type, value })

}


export const getCountries = () => (dispatch, getState) => {
  dispatch({
    type: LOAD_COUNTRIES
  })
  api.getCountriesData().then(data => {
    dispatch({
      type: LOAD_COUNTRIES_DONE,
      data: data.sort((a, b) => a.country.localeCompare(b.country))
    })
  }).catch(error => {
    dispatch({
      type: LOAD_COUNTRIES_ERROR,
      error
    })
  })
}

export const getIndicators = () => (dispatch, getState) => {
  dispatch({
    type: LOAD_INDICATORS
  })
  api.getIndicatorsData().then(data => {
    dispatch({
      type: LOAD_INDICATORS_DONE,
      data: data//.sort((a, b) => a.country.localeCompare(b.country))
    })
  }).catch(error => {
    dispatch({
      type: LOAD_INDICATORS_ERROR,
      error
    })
  })
}
export const getIndicatorsInformation = (categoryId) => (dispatch, getState) => {
  dispatch({
    type: LOAD_INDICATORS_INFORMATION,
    param: categoryId
  })
  api.getIndicatorsInformation(categoryId).then(data => {
    dispatch({
      type: LOAD_INDICATORS_INFORMATION_DONE,
      param: categoryId,
      data: data
    })
  }).catch(error => {
    dispatch({
      type: LOAD_INDICATORS_INFORMATION_ERROR,
      param: categoryId,
      error
    })
  })
}

export const setData = ({ app, csv, store, params }) => (dispatch, getState) => {
  const filters = getState().get('data').getIn(['filters'])
  if (filters) {
    params = { ...params, ...filters.toJS() }
  }

  const data = Papa.parse(csv, { header: true });
  dispatch({ type: LOAD_DATA_DONE, store, data })

}

export const getData = ({ app, source, store, params }) => (dispatch, getState) => {
  const filters = getState().get('data').getIn(['filters'])
  if (filters) {
    params = { ...params, ...filters.toJS() }
  }
  dispatch({ type: LOAD_DATA, params, store })
  api.getData({ app, source, params })
    .then(data => dispatch({ type: LOAD_DATA_DONE, store, data }))
    .catch(error => dispatch({ type: LOAD_DATA_ERROR, store, error }))
}


export const detectClientCountry = () => (dispatch) => {
  dispatch({ type: LOAD_COUNTRY_SETTINGS })
  return api.loadCountrySettings()
    .then(data => {
      return dispatch({ type: LOAD_COUNTRY_SETTINGS_DONE, data: data });
    })
    .catch(error => {
      return dispatch({ type: LOAD_COUNTRY_SETTINGS_ERROR, error });
    })
}
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_DATA: {
      const { store } = action

      return state.deleteIn([...store, 'error']).setIn([...store, 'loading'], true)
    }
    case LOAD_DATA_ERROR: {
      const { error, store } = action
      return state
        .setIn([...store, 'loading'], false)
        .setIn([...store, 'error'], error)
    }
    case LOAD_DATA_DONE: {
      const { data, store } = action

      return state
        .setIn([...store, 'loading'], false)
        .deleteIn([...store, 'error'])
        .setIn([...store, 'data'], data)
    }


    case LOAD_COUNTRIES:
      return state
    case LOAD_COUNTRIES_DONE: {
      const { data } = action
      return state.setIn([COUNTRIES_FILTER], data)
    }
    case LOAD_COUNTRIES_ERROR:
      return state

    case LOAD_INDICATORS: {
      return state
    }

    case LOAD_INDICATORS_DONE: {
      const { data } = action
      return state.setIn([SUMMARY_INDICATORS], data)
    }

    case LOAD_INDICATORS_ERROR:{
      return state
    }
    case LOAD_INDICATORS_INFORMATION: {
      return state
    }

    case LOAD_INDICATORS_INFORMATION_DONE: {
      const { data } = action
      return state.setIn([SUMMARY_INDICATORS_INFORMATION], data)
    }

    case LOAD_INDICATORS_INFORMATION_ERROR:{
      return state
    }


    case SET_FILTER: {
      const { param, value } = action
      if (value.length === 0) {
        return state.deleteIn(['filters', param], value)
      }
      return state.setIn(['filters', param], value)
    }


    case LOAD_COUNTRY_SETTINGS: {
      return state.deleteIn([COUNTRY_SETTINGS, 'error']).setIn([COUNTRY_SETTINGS, 'loading'], true)
    }

    case LOAD_COUNTRY_SETTINGS_ERROR: {
      return state
        .setIn([COUNTRY_SETTINGS, 'loading'], false)
        .setIn([COUNTRY_SETTINGS, 'error'], action.error)
    }
    case LOAD_COUNTRY_SETTINGS_DONE: {


      return state
        .setIn([COUNTRY_SETTINGS, 'loading'], false)
        .deleteIn([COUNTRY_SETTINGS, 'error'])
        .setIn([COUNTRY_SETTINGS, 'data'], action.data)
    }

    default:
      return state
  }
}
export default reducer;

