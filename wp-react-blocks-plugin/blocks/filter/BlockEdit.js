import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
    Panel,
    PanelBody,
    PanelRow,
    SelectControl,
    TextControl,
    CheckboxControl,
    RangeControl,
    ToggleControl
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BaseBlockEdit } from '../commons/index'

export const COUNTRY = 'Country';
const CAROUSEL = 'Carousel';

class BlockEdit extends BaseBlockEdit {

    render() {
        const {
            className, isSelected,
            toggleSelection, setAttributes, attributes: {
                type, selectedCountryFirst, addYear, selectedCountryLabel, countryColumns,
                dataSource, additionalClasses, showSelector, selectedCountryPostLabel, addAllCountries,
                isAddIndicatorFilter
            }
        } = this.props;

        let queryString = `data-type=${type}`;
        queryString += `&data-selected-country-first=${selectedCountryFirst}`;
        queryString += `&data-add-year=${addYear}`;
        queryString += `&data-selected-country-label=${selectedCountryLabel}`;
        queryString += `&data-selected-country-post-label=${selectedCountryPostLabel}`;
        queryString += `&data-country-columns=${countryColumns}`;
        queryString += `&data-data-source=${dataSource}`;
        queryString += `&data-additional-classes=${additionalClasses}`;
        queryString += `&data-show-selector=${showSelector}`;
        if (type === COUNTRY) {
            queryString += `&data-add-all-countries=${addAllCountries}`;
            queryString += `&data-add-indicator-filter=${isAddIndicatorFilter}`;
        }

        queryString += `&editing=true`
        const divStyles = {}
        return ([isSelected && (<InspectorControls>
                <Panel header={__("Filters Configuration")}>
                    <PanelBody>
                        <PanelRow>
                            <SelectControl
                                label={__('Type:')}
                                value={[type]} // e.g: value = [ 'a', 'c' ]
                                onChange={(value) => {
                                    setAttributes({ type: value })
                                }}
                                options={[
                                    { label: COUNTRY, value: COUNTRY },
                                    { label: CAROUSEL, value: CAROUSEL }
                                ]}
                            />
                        </PanelRow>
                        {type === COUNTRY && <PanelRow>
                            <CheckboxControl
                                label={__('Add all countries')}
                                checked={addAllCountries}
                                onChange={() => setAttributes({ addAllCountries: !addAllCountries })} />
                        </PanelRow>}
                        {type === COUNTRY && <PanelRow>
                            <ToggleControl
                                label={__("Add indicator filter")}
                                checked={isAddIndicatorFilter}
                                onChange={(isAddIndicatorFilter) => setAttributes({ isAddIndicatorFilter })}
                            />
                        </PanelRow>}
                        <PanelRow>
                            <SelectControl
                                label={__('DataSource:')}
                                value={[dataSource]}
                                onChange={(value) => {
                                    setAttributes({ dataSource: value })
                                }}
                                options={[
                                    { label: 'Latest country studies', value: 'latestCountryStudies' },
                                    { label: 'Country researcher list', value: 'countryResearcherList ' },
                                    { label: 'Others country list', value: 'countryOthersList ' }
                                ]}
                            />
                        </PanelRow>
                        <PanelRow>
                            <CheckboxControl
                                label={__('Selected country first')}
                                checked={selectedCountryFirst}
                                onChange={() => setAttributes({ selectedCountryFirst: !selectedCountryFirst })} />
                        </PanelRow>
                        <PanelRow>
                            <CheckboxControl
                                label={__('Add year')}
                                checked={addYear}
                                onChange={() => setAttributes({ addYear: !addYear })} />
                        </PanelRow>
                        <PanelRow>
                            <CheckboxControl
                                label={__('Show country selector')}
                                checked={showSelector}
                                onChange={() => setAttributes({ showSelector: !showSelector })} />
                        </PanelRow>

                        <PanelRow>
                            <TextControl
                                label={__('Selected country label')}
                                value={selectedCountryLabel}
                                onChange={(selectedCountryLabel) => setAttributes({ selectedCountryLabel })}
                            /></PanelRow>
                        <PanelRow>
                            <TextControl
                                label={__('Selected country post label')}
                                value={selectedCountryPostLabel}
                                onChange={(selectedCountryPostLabel) => setAttributes({ selectedCountryPostLabel })}
                            /></PanelRow>
                        <PanelRow>
                            <TextControl
                                label={__('Additional classes')}
                                value={additionalClasses}
                                onChange={(additionalClasses) => setAttributes({ additionalClasses })}
                            /></PanelRow>
                        <PanelRow>
                            <RangeControl
                                label={__('Country columns count')}
                                value={countryColumns}
                                onChange={(countryColumns) => setAttributes({ countryColumns })}
                                min={1}
                                max={1000}
                            /></PanelRow>
                    </PanelBody>
                </Panel>
            </InspectorControls>),

                (<div>
                        <iframe id={"id_description_iframe"} scrolling={"no"}
                                style={divStyles}
                                src={this.state.react_ui_url + "/en/embeddable/filter?" + queryString} />
                    </div>

                )]
        );

    }
}


const Edit = (props) => {

    const blockProps = useBlockProps({ className: 'wp-react-component' });
    return <div {...blockProps}><BlockEdit {...props} /></div>;


}
export default Edit;