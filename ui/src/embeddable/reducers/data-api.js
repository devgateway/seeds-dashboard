import {
    COUNTRY_INFO,
    NUMBER_OF_VARIETIES_RELEASED,
    EFFICIENCY_SEED_IMPORT_PROCESS,
    VARIETIES_RELEASED_WITH_SPECIAL_FEATURES,
    NUMBER_VARIETIES_SOLD,
    PERFORMANCE_SEED_TRADERS,
    AVAILABILITY_OF_BASIC_SEED,
    DEFAULT_COUNTRY_ID,
    AVERAGE_AGE_VARIETIES_SOLD,
    NUMBER_SEED_INSPECTORS,
    NUMBER_OF_ACTIVE_BREEDERS,
    WP_CHART,
    MARKET_CONCENTRATION_HHI,
    EFFICIENCY_SEED_EXPORT_PROCESS,
    VARIETY_RELEASE_PROCESS,
    MARKET_SHARE_TOP_FOUR_SEED_COMPANIES,
    MARKET_SHARE_STATE_OWNED_SEED_COMPANIES,
    QUANTITY_CERTIFIED_SEED_SOLD,
    SATISFACTION_ENFORCEMENT_SEED_LAW,
    PRICE_SEED_PLANTING,
    AVAILABILITY_SEED_SMALL_PACKAGES,
    AGRODEALER_NETWORK,
    AGRICULTURAL_EXTENSION_SERVICES, NUMBER_SEED_INSPECTORS_BY_COUNTRY,
    CROSS_COUNTRY_NUMBER_OF_ACTIVE_BREEDERS,
    CROSS_COUNTRY_NUMBER_OF_VARIETIES_RELEASED,
    CROSS_COUNTRY_QUANTITY_CERTIFIED_SEED_SOLD,
    CROSS_COUNTRY_NUMBER_OF_ACTIVE_SEED_COMPANIES,
    CROSS_COUNTRY_NUMBER_VARIETIES_SOLD,
    CROSS_COUNTRY_MARKET_SHARE_TOP_FOUR_SEED_COMPANIES,
    CROSS_COUNTRY_MARKET_CONCENTRATION_HHI,
    CROSS_COUNTRY_MARKET_SHARE_STATE_OWNED_SEED_COMPANIES,
    CROSS_COUNTRY_VARIETY_RELEASE_PROCESS, CROSS_COUNTRY_OVERALL_RATING_NATIONAL_SEED_TRADE_ASSOCIATION,
    CROSS_COUNTRY_AGRODEALER_NETWORK
} from "./StoreConstants";
import { SELECTED_COUNTRY } from "../../seeds-commons/commonConstants";
import { get, getAll, post } from "../../seeds-commons/commons";

const SURVEY_API = process.env.REACT_APP_SURVEY_API
const IP_INFO_URL = 'https://ipinfo.io/json?token=145d05e17c7c25';
const APP_WP_API = process.env.REACT_APP_WP_API;
//TODO add parameters as config
const WP_CATEGORIES = APP_WP_API + '/wp/v2/categories';
const POLICY_API_ROOT = process.env.REACT_APP_POLICY_API
const SURVEY_FILTER_API = 'filter';
const DATA_SUMMARY = 'dataSummary';
const SURVEY_COUNTRIES_API = `${SURVEY_API}/${SURVEY_FILTER_API}/`
const SURVEY_INDICATORS_API = `${SURVEY_API}/${SURVEY_FILTER_API}/indicators`
const SURVEY_INDICATOR_INFORMATION_API = `${SURVEY_API}/${DATA_SUMMARY}/categoryId/{categoryId}/latest`;
const WP_DOCUMENTS_API = `${APP_WP_API}/wp/v2/media`;
let COUNTRY_INFORMATION_API = `${SURVEY_API}/countryInfo/countryId/`;
let NUMBER_OF_VARIETIES_RELEASED_API = `${SURVEY_API}/chart/numberVarietiesReleased/year/crop`;
let VARIETIES_RELEASED_WITH_SPECIAL_FEATURES_API = `${SURVEY_API}/chart/cropsReleased/crop/year`;
let AVERAGE_AGE_VARIETIES_SOLD_API = `${SURVEY_API}/chart/averageAgeVarietiesSold/crop/year`;
let AVAILABILITY_OF_BASIC_SEED_API = `${SURVEY_API}/chart/availabilityBasicSeed/crop/year/`;
let NUMBER_VARIETIES_SOLD_API = `${SURVEY_API}/chart/numberVarietiesSold/crop/year/`;
let PERFORMANCE_SEED_TRADERS_API = `${SURVEY_API}/chart/performanceSeedTraders/performance/year/`;
const MARKET_SHARE_TOP_FOUR_SEED_COMPANIES_API = `${SURVEY_API}/chart/marketShareTop4/crop/year`;
const MARKET_SHARE_STATE_OWNED_SEED_COMPANIES_API = `${SURVEY_API}/chart/marketShareStateOwned/crop/year`;
const NUMBER_OF_ACTIVE_BREEDERS_API = `${SURVEY_API}/chart/numberActiveBreeders/year/crop/`;
const MARKET_CONCENTRATION_HHI_API = `${SURVEY_API}/chart/marketConcentration/crop/year/`;
const EFFICIENCY_SEED_IMPORT_PROCESS_API = `${SURVEY_API}/chart/efficiencyImportProcess/crop/year/`;
const EFFICIENCY_SEED_EXPORT_PROCESS_API = `${SURVEY_API}/chart/efficiencyExportProcess/crop/year/`;
const NUMBER_SEED_INSPECTORS_API = `${SURVEY_API}/chart/numberSeedInspectors/year/`;
const SATISFACTION_ENFORCEMENT_SEED_LAW_API = `${SURVEY_API}/chart/satisfactionLawRegulation/year/`;
const VARIETY_RELEASE_PROCESS_API = `${SURVEY_API}/chart/varietyReleaseProcess/year/`;
const QUANTITY_CERTIFIED_SEED_SOLD_API = `${SURVEY_API}/chart/quantitySeedSold/crop/year/`;
const PRICE_SEED_PLANTING_API = `${SURVEY_API}/chart/priceSeedPlanting/crop/year/`;
const AVAILABILITY_SEED_SMALL_PACKAGES_API = `${SURVEY_API}/chart/availabilitySeedSmallPackages/year/crop/packages`;
const AGRODEALER_NETWORK_API = `${SURVEY_API}/chart/agrodealerNetwork/year/`;
const AGRICULTURAL_EXTENSION_SERVICES_API = `${SURVEY_API}/chart/agriculturalExtensionServices/year/`;
const NUMBER_SEED_INSPECTORS_BY_COUNTRY_API = `${SURVEY_API}/chart/cc/numberSeedInspectors/`;
const CROPS_BY_COUNTRY_YEAR_API = `${SURVEY_API}/filter/countryCrops/`;
const TOOLTIP_SAVE_URL = `${SURVEY_API}/tooltip/save`;
const TOOLTIP_LOAD_URL = `${SURVEY_API}/tooltip/list`;

const CROSS_COUNTRY_NUMBER_OF_ACTIVE_BREEDERS_API = `${SURVEY_API}/chart/cc/numberActiveBreeders`;
const CROSS_COUNTRY_NUMBER_OF_VARIETIES_RELEASED_API = `${SURVEY_API}/chart/cc/numberVarietiesReleased`;
const CROSS_COUNTRY_QUANTITY_CERTIFIED_SEED_SOLD_API = `${SURVEY_API}/chart/cc/quantitySeedSold`;
const CROSS_COUNTRY_NUMBER_OF_ACTIVE_SEED_COMPANIES_API = `${SURVEY_API}/chart/cc/numberActiveCompanies`;
const CROSS_COUNTRY_NUMBER_VARIETIES_SOLD_API = `${SURVEY_API}/chart/cc/numberVarietiesSold`;
const CROSS_COUNTRY_MARKET_SHARE_TOP_FOUR_SEED_COMPANIES_API = `${SURVEY_API}/chart/cc/marketShareTop4`;
const CROSS_COUNTRY_MARKET_CONCENTRATION_HHI_API = `${SURVEY_API}/chart/cc/marketConcentration`;
const CROSS_COUNTRY_MARKET_SHARE_STATE_OWNED_SEED_COMPANIES_API = `${SURVEY_API}/chart/cc/marketShareStateOwned`;
const CROSS_COUNTRY_VARIETY_RELEASE_PROCESS_API = `${SURVEY_API}/chart/cc/varietyReleaseProcessLength`;
const CROSS_COUNTRY_OVERALL_RATING_NATIONAL_SEED_TRADE_ASSOCIATION_API = `${SURVEY_API}/chart/cc/seedTradeAssociationRating`;
const CROSS_COUNTRY_AGRODEALER_NETWORK_API = `${SURVEY_API}/chart/cc/agriculturalHouseholds`;

const APIS = {
    prevalence: '',
    policy: POLICY_API_ROOT,
    [COUNTRY_INFO]: COUNTRY_INFORMATION_API,
    [MARKET_CONCENTRATION_HHI]: MARKET_CONCENTRATION_HHI_API,
    [NUMBER_OF_VARIETIES_RELEASED]: NUMBER_OF_VARIETIES_RELEASED_API,
    [VARIETIES_RELEASED_WITH_SPECIAL_FEATURES]: VARIETIES_RELEASED_WITH_SPECIAL_FEATURES_API,
    [AVERAGE_AGE_VARIETIES_SOLD]: AVERAGE_AGE_VARIETIES_SOLD_API,
    [AVAILABILITY_OF_BASIC_SEED]: AVAILABILITY_OF_BASIC_SEED_API,
    [NUMBER_OF_ACTIVE_BREEDERS]: NUMBER_OF_ACTIVE_BREEDERS_API,
    [AVAILABILITY_SEED_SMALL_PACKAGES]: AVAILABILITY_SEED_SMALL_PACKAGES_API,
    [NUMBER_VARIETIES_SOLD]: NUMBER_VARIETIES_SOLD_API,
    [SATISFACTION_ENFORCEMENT_SEED_LAW]: SATISFACTION_ENFORCEMENT_SEED_LAW_API,
    [MARKET_SHARE_TOP_FOUR_SEED_COMPANIES]: MARKET_SHARE_TOP_FOUR_SEED_COMPANIES_API,
    [MARKET_SHARE_STATE_OWNED_SEED_COMPANIES]: MARKET_SHARE_STATE_OWNED_SEED_COMPANIES_API,
    [EFFICIENCY_SEED_IMPORT_PROCESS]: EFFICIENCY_SEED_IMPORT_PROCESS_API,
    [PERFORMANCE_SEED_TRADERS]: PERFORMANCE_SEED_TRADERS_API,
    [EFFICIENCY_SEED_EXPORT_PROCESS]: EFFICIENCY_SEED_EXPORT_PROCESS_API,
    [NUMBER_SEED_INSPECTORS]: NUMBER_SEED_INSPECTORS_API,
    [VARIETY_RELEASE_PROCESS]: VARIETY_RELEASE_PROCESS_API,
    [QUANTITY_CERTIFIED_SEED_SOLD]: QUANTITY_CERTIFIED_SEED_SOLD_API,
    [PRICE_SEED_PLANTING]: PRICE_SEED_PLANTING_API,
    [AGRODEALER_NETWORK]: AGRODEALER_NETWORK_API,
    [AGRICULTURAL_EXTENSION_SERVICES]: AGRICULTURAL_EXTENSION_SERVICES_API,
    [NUMBER_SEED_INSPECTORS_BY_COUNTRY]: NUMBER_SEED_INSPECTORS_BY_COUNTRY_API,
    [CROSS_COUNTRY_NUMBER_OF_ACTIVE_BREEDERS]: CROSS_COUNTRY_NUMBER_OF_ACTIVE_BREEDERS_API,
    [CROSS_COUNTRY_NUMBER_OF_VARIETIES_RELEASED]: CROSS_COUNTRY_NUMBER_OF_VARIETIES_RELEASED_API,
    [CROSS_COUNTRY_QUANTITY_CERTIFIED_SEED_SOLD]: CROSS_COUNTRY_QUANTITY_CERTIFIED_SEED_SOLD_API,
    [CROSS_COUNTRY_NUMBER_OF_ACTIVE_SEED_COMPANIES]: CROSS_COUNTRY_NUMBER_OF_ACTIVE_SEED_COMPANIES_API,
    [CROSS_COUNTRY_NUMBER_VARIETIES_SOLD]: CROSS_COUNTRY_NUMBER_VARIETIES_SOLD_API,
    [CROSS_COUNTRY_MARKET_SHARE_TOP_FOUR_SEED_COMPANIES]: CROSS_COUNTRY_MARKET_SHARE_TOP_FOUR_SEED_COMPANIES_API,
    [CROSS_COUNTRY_MARKET_CONCENTRATION_HHI]: CROSS_COUNTRY_MARKET_CONCENTRATION_HHI_API,
    [CROSS_COUNTRY_MARKET_SHARE_STATE_OWNED_SEED_COMPANIES]: CROSS_COUNTRY_MARKET_SHARE_STATE_OWNED_SEED_COMPANIES_API,
    [CROSS_COUNTRY_VARIETY_RELEASE_PROCESS]: CROSS_COUNTRY_VARIETY_RELEASE_PROCESS_API,
    [CROSS_COUNTRY_OVERALL_RATING_NATIONAL_SEED_TRADE_ASSOCIATION]: CROSS_COUNTRY_OVERALL_RATING_NATIONAL_SEED_TRADE_ASSOCIATION_API,
    [CROSS_COUNTRY_AGRODEALER_NETWORK]: CROSS_COUNTRY_AGRODEALER_NETWORK_API
}

function queryParams(params) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&')
}

export const getCountriesData = (dataSource, params) => {
    return get(SURVEY_COUNTRIES_API + dataSource, params)
}
export const getCategoriesWP = (params) => {
    //return get(WP_CATEGORIES, params)
    return getAll(WP_CATEGORIES);
}
export const getIndicatorsData = (params) => {
    return get(SURVEY_INDICATORS_API, params)
}

export const getData = ({ source, app, params }) => {
    let sources;
    if (source) {
        sources = source.split("|");
    }

    if (app === COUNTRY_INFO && params && (params[SELECTED_COUNTRY] || params[DEFAULT_COUNTRY_ID])) {
        let countryId = params[DEFAULT_COUNTRY_ID];
        if (params[SELECTED_COUNTRY]) {
            countryId = params[SELECTED_COUNTRY];
            delete params[DEFAULT_COUNTRY_ID];
        }
        return get(APIS[app] + countryId);
    } else if (app === NUMBER_OF_VARIETIES_RELEASED
        || app === AVAILABILITY_OF_BASIC_SEED
        || app === MARKET_SHARE_TOP_FOUR_SEED_COMPANIES
        || app === MARKET_CONCENTRATION_HHI
        || app === VARIETIES_RELEASED_WITH_SPECIAL_FEATURES
        || app === AVERAGE_AGE_VARIETIES_SOLD
        || app === SATISFACTION_ENFORCEMENT_SEED_LAW
        || app === NUMBER_OF_ACTIVE_BREEDERS
        || app === NUMBER_VARIETIES_SOLD
        || app === EFFICIENCY_SEED_IMPORT_PROCESS
        || app === PERFORMANCE_SEED_TRADERS
        || app === NUMBER_SEED_INSPECTORS
        || app === MARKET_SHARE_STATE_OWNED_SEED_COMPANIES
        || app === EFFICIENCY_SEED_EXPORT_PROCESS
        || app === VARIETY_RELEASE_PROCESS
        || app === QUANTITY_CERTIFIED_SEED_SOLD
        || app === AVAILABILITY_SEED_SMALL_PACKAGES
        || app === PRICE_SEED_PLANTING
        || app === AGRODEALER_NETWORK
        || app === AGRICULTURAL_EXTENSION_SERVICES
        || app === NUMBER_SEED_INSPECTORS_BY_COUNTRY
        || app === CROSS_COUNTRY_NUMBER_OF_ACTIVE_BREEDERS
        || app === CROSS_COUNTRY_NUMBER_OF_VARIETIES_RELEASED
        || app === CROSS_COUNTRY_QUANTITY_CERTIFIED_SEED_SOLD
        || app === CROSS_COUNTRY_NUMBER_OF_ACTIVE_SEED_COMPANIES
        || app === CROSS_COUNTRY_NUMBER_VARIETIES_SOLD
        || app === CROSS_COUNTRY_MARKET_SHARE_TOP_FOUR_SEED_COMPANIES
        || app === CROSS_COUNTRY_MARKET_CONCENTRATION_HHI
        || app === CROSS_COUNTRY_MARKET_SHARE_STATE_OWNED_SEED_COMPANIES
        || app === CROSS_COUNTRY_VARIETY_RELEASE_PROCESS
        || app === CROSS_COUNTRY_OVERALL_RATING_NATIONAL_SEED_TRADE_ASSOCIATION
        || app === CROSS_COUNTRY_AGRODEALER_NETWORK
        || (sources && sources.length > 0 && sources[0] === WP_CHART)
    ) {
        let api;
        if (sources && sources[0] === WP_CHART) {
            api = `${SURVEY_API}/chart/${app}/${sources[1]}/${sources[2]}`;
        } else {
            api = APIS[app];
        }
        if (app.endsWith("_crossCountry")) {
            const apiToCall = api + (params ? '?' + queryParams(params) : '');
            return get(apiToCall);
        } else if (params[SELECTED_COUNTRY] || params[DEFAULT_COUNTRY_ID]) {
            params.countryId = params[DEFAULT_COUNTRY_ID];
            if (params[SELECTED_COUNTRY]) {
                params.countryId = params[SELECTED_COUNTRY];
                delete params[DEFAULT_COUNTRY_ID];
            }
            const apiToCall = api + (params ? '?' + queryParams(params) : '');
            return get(apiToCall);
        } else {
            // TODO: remove this after we are sure we will always use the country filter component.
            return Promise.resolve();
        }
    } else {
        return get(APIS[app] + (params ? '?' + queryParams(params) : ''))
    }
}

export function getIndicatorsInformation(categoryId) {
    return get(SURVEY_INDICATOR_INFORMATION_API.replace("{categoryId}", categoryId))
}

export const loadCustomTooltips = () => {
    return get(TOOLTIP_LOAD_URL);
}
export const loadCountrySettings = () => {
    return get(IP_INFO_URL);
}
export const saveTooltips = (tooltip) => {
    return post(TOOLTIP_SAVE_URL, tooltip)
}
export const getDocumentsData = (params) => {
    // let documentsApi = WP_DOCUMENTS_API + (params ? '?' + queryParams(params) : '')
    // return get(documentsApi, params)
    return getAll(WP_DOCUMENTS_API);
}

export const getCropsData = (params) => {

    let api = CROPS_BY_COUNTRY_YEAR_API;
    // TODO: re-enable filter by country+year after making the EP ignore cases.
    /*
    const { country, year } = params;
    if (country && year) {
      api += country + '/' + year;
    } */
    return get(api, null);
}

