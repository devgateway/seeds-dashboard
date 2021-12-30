import { get } from '../../api/commons'

const SURVEY_API = process.env.REACT_APP_SURVEY_API
const APP_WP_API = process.env.REACT_APP_WP_API;
//TODO add parameters as config
const WP_CATEGORIES = APP_WP_API + '/wp/v2/categories?per_page=100&_locale=user';
const POLICY_API_ROOT = process.env.REACT_APP_POLICY_API
const SURVEY_FILTER_API = 'filter';
const DATA_SUMMARY = 'dataSummary';
const SURVEY_COUNTRIES_API = `${SURVEY_API}/${SURVEY_FILTER_API}/latestCountryStudies`
const SURVEY_INDICATORS_API = `${SURVEY_API}/${SURVEY_FILTER_API}/indicators`
const SURVEY_INDICATOR_INFORMATION_API = `${SURVEY_API}/${DATA_SUMMARY}/categoryId/{categoryId}/latest`;
const WP_DOCUMENTS_API = `${APP_WP_API}/wp/v2/media`;

//TODO remove hardcoded country once SEEDSDT-243 is done
let COUNTRY_INFORMATION_API = `${SURVEY_API}/countryInfo/countryId/9`;
const APIS = {
  prevalence: '',
  policy: POLICY_API_ROOT,
  countryInfo: COUNTRY_INFORMATION_API
}

function queryParams(params) {
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&')
}

export const getCountriesData = (params) => {
  return get(SURVEY_COUNTRIES_API, params)
}
export const getCategoriesWP = (params) => {
  return get(WP_CATEGORIES, params)
}
export const getIndicatorsData = (params) => {
  return get(SURVEY_INDICATORS_API, params)
}

export const getData = ({ source, app, params }) => {
  return get(APIS[app] + (params ? '?' + queryParams(params) : ''))
}

export function getIndicatorsInformation(categoryId) {
  return get(SURVEY_INDICATOR_INFORMATION_API.replace("{categoryId}", categoryId))
}

export const loadCountrySettings = () => {
  return get('https://ipinfo.io/json?token=145d05e17c7c25');
}

export const getDocumentsData = (params) => {
  return get(WP_DOCUMENTS_API, params)
}

