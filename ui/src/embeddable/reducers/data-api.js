import { get } from '../../api/commons'


const SURVEY_API = process.env.REACT_APP_SURVEY_API
const POLICY_API_ROOT = process.env.REACT_APP_POLICY_API

const SURVEY_COUNTRIES_API = `${SURVEY_API}/filter/latestCountryStudies`

const APIS = {
  prevalence: '',
  policy: POLICY_API_ROOT
}

function queryParams(params) {
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&')
}

export const getCountriesData = (params) => {
  return get(SURVEY_COUNTRIES_API, params)
}

export const getData = ({ source, app, params }) => {
  return get(APIS[app] + "/stats/" + source + (params ? '?' + queryParams(params) : ''))
}
export const loadCountrySettings = () => {
  return get('https://ipinfo.io/json?token=145d05e17c7c25');
}

