import {get} from '../../api/commons'

const URL_TAXONOMY = process.env.REACT_APP_TAXONOMY_API
const URL_STATS = process.env.REACT_APP_STATS_API

function queryParams(params) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&')
}

export const getCategories = (params) => {
    return get(URL_TAXONOMY, params)
}

export const getData = (path, params) => {
    return get(URL_STATS + "/" + path+(params?'?'+queryParams(params):''))
}
