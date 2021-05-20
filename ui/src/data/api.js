import {get} from '../api/commons'
const API_ROOT = document.location.href.indexOf('localhost') > -1 ? 'http://localhost:8070' : "https://tasai.dgstg.org"
const URL_TAXONOMY = API_ROOT + '/api/categories'
const URL_STATS = API_ROOT + '/api'

function queryParams(params) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&')
}

export const getCategories = (params) => {
    return get(URL_TAXONOMY, params)
}


export const getData = (path, params) => {
    //return get(URL_STATS )
    return get(URL_STATS + "/" + path+(params?'?'+queryParams(params):''))
}
