import { useBlockProps } from '@wordpress/block-editor';
import { COUNTRY } from "./BlockEdit";

const SaveComponent = (props) => {

    const {
        attributes: {
            type,
            selectedCountryFirst,
            addYear,
            selectedCountryLabel,
            countryColumns,
            dataSource,
            additionalClasses,
            showSelector,
            selectedCountryPostLabel,
            addAllCountries,
            isAddIndicatorFilter
        }
    } = props;
    const blockProps = useBlockProps.save({
        className: 'wp-react-lib component chart'
    });

    const divClass = {}
    const divStyles = {}
    return (
        <div className={"wp-react-lib-component"}
             data-component={"filter"}
             data-type={type}
             data-selected-country-first={selectedCountryFirst}
             data-add-year={addYear}
             data-selected-country-label={selectedCountryLabel}
             data-country-columns={countryColumns}
             data-data-source={dataSource}
             data-additional-classes={additionalClasses}
             data-show-selector={showSelector}
             data-selected-country-post-label={selectedCountryPostLabel}

             {...(
                 type === COUNTRY ?
                     { 'data-add-all-countries': addAllCountries } :
                     {}
             )}
             {...(
                 type === COUNTRY ?
                     { 'data-add-indicator-filter': isAddIndicatorFilter} :
                     {}
             )}>
        </div>


    );
}


export default SaveComponent
