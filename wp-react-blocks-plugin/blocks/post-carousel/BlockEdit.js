import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
    __experimentalNumberControl as NumberControl,
    Panel,
    PanelBody,
    PanelRow,
    ResizableBox,
    CheckboxControl,
    TextControl,
    SelectControl,
    ToggleControl
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BlockEditWithFilters, SizeConfig } from "../commons";
import { FIELD_ORIENTATION_HORIZONTAL, FIELD_ORIENTATION_VERTICAL } from "./index";


class BlockEdit extends BlockEditWithFilters {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            className, isSelected,
            toggleSelection,
            setAttributes,
            attributes: {
                count,
                type,
                taxonomy,
                categories,
                height,
                itemsPerPage,
                connectFilter,
                valuesFilterStore,
                selectedFilterStore,
                scheduledFilter,
                scheduledFilterStore,
                fieldOrientation,
                navigatorStyle,
                showLinksInModal,
                sortedByCountryAndYearCategories,
                preloadDocumentsAndCrops,
                isNewImplementation
            },
        } = this.props;
        let queryString = `editing=true&data-type=${type}`
        queryString += `&data-taxonomy=${taxonomy}`;
        queryString += `&data-categories=${categories}`;
        queryString += `&data-items=${count}`;
        queryString += `&data-height=${height}`;
        queryString += `&data-items-per-page=${itemsPerPage}`;
        queryString += `&data-connect-filter=${connectFilter}`;
        queryString += `&data-values-filter-store=${valuesFilterStore}`;
        queryString += `&data-selected-filter-store=${selectedFilterStore}`;
        queryString += `&data-orientation=${fieldOrientation}`;
        queryString += `&data-navigator-style=${navigatorStyle}`;
        queryString += `&data-scheduled-filter=${scheduledFilter}`;
        queryString += `&data-show-links-in-modal=${showLinksInModal}`;
        queryString += `&data-show-sorted-by-country-and-year-categories=${sortedByCountryAndYearCategories}`;
        queryString += `&data-preload-document-and-crops=${preloadDocumentsAndCrops}`
        queryString += `&data-scheduled-filter-store=${scheduledFilterStore}`;
        queryString += `&data-new-implementation=${isNewImplementation}`
        const divStyles = { height: height + 'px', width: '100%' }

        return (
            <div>
                <InspectorControls>
                    <Panel header={__("Carousel Configuration")}>
                        <PanelBody>
                            <PanelRow>
                                <NumberControl
                                    isShiftStepEnabled={true}
                                    onChange={(count) => setAttributes({ count: getNumberOfZeroIfEmpty(count) })}
                                    shiftStep={10}
                                    value={count}
                                    label={__("Items (0 for all)")} />
                            </PanelRow>
                            <PanelRow>
                                <NumberControl
                                    isShiftStepEnabled={true}
                                    onChange={(itemsPerPage) =>
                                        setAttributes({ itemsPerPage: getNumberOfZeroIfEmpty(itemsPerPage) })}
                                    shiftStep={10}
                                    value={itemsPerPage}
                                    label={__("items per page")} />
                            </PanelRow>
                            <SelectControl
                                label={__('Navigator style:')}
                                value={[navigatorStyle]}
                                onChange={(navigatorStyle) => {
                                    setAttributes({ navigatorStyle })
                                }}
                                options={[
                                    { label: 'Dots', value: 'dots' },
                                    { label: 'Paged Dots', value: 'paged-dots' },
                                    { label: 'Buttons', value: 'buttons' },
                                    { label: 'None', value: 'none' }
                                ]}
                            />
                            <SelectControl
                                label={__('Orientation:')}
                                value={[fieldOrientation]}
                                onChange={(fieldOrientation) => {
                                    setAttributes({ fieldOrientation })
                                }}
                                options={[
                                    { label: 'Vertical', value: FIELD_ORIENTATION_VERTICAL },
                                    { label: 'Horizontal', value: FIELD_ORIENTATION_HORIZONTAL }
                                ]}
                            />
                            <PanelRow>
                                <ToggleControl
                                    label={__("Show links in Modal")}
                                    checked={showLinksInModal}
                                    onChange={(showLinksInModal) => setAttributes({ showLinksInModal })}
                                />
                            </PanelRow>
                            <PanelRow>
                                <ToggleControl
                                    label={__("Order by year and country")}
                                    checked={sortedByCountryAndYearCategories}
                                    onChange={(sortedByCountryAndYearCategories) => setAttributes({ sortedByCountryAndYearCategories })}
                                />
                            </PanelRow>
                            <PanelRow>
                                <ToggleControl
                                    label={__("Preload documents and crops")}
                                    checked={preloadDocumentsAndCrops}
                                    onChange={(preloadDocumentsAndCrops) => setAttributes({ preloadDocumentsAndCrops })}
                                />
                            </PanelRow>
                            <PanelRow>
                                <ToggleControl
                                    label={__("Is new implementation")}
                                    checked={isNewImplementation}
                                    onChange={(isNewImplementation) => setAttributes({ isNewImplementation })}
                                />
                            </PanelRow>
                        </PanelBody>
                        <SizeConfig initialOpen={false} setAttributes={setAttributes} height={height}></SizeConfig>
                        {this.renderFilters()}
                    </Panel>
                    <PanelBody title={__("Carousel Filters configuration")}>
                        <PanelRow>
                            <CheckboxControl
                                label={__('Connect filter component')}
                                checked={connectFilter}
                                onChange={() => setAttributes({ connectFilter: !connectFilter })} />
                        </PanelRow>
                        {connectFilter && <PanelRow>
                            <TextControl
                                label={__('Values store')}
                                value={valuesFilterStore}
                                onChange={(valuesFilterStore) => setAttributes({ valuesFilterStore })}
                            /></PanelRow>}
                        {connectFilter && <PanelRow>
                            <TextControl
                                label={__('selected filter store')}
                                value={selectedFilterStore}
                                onChange={(selectedFilterStore) => setAttributes({ selectedFilterStore })}
                            /></PanelRow>}
                    </PanelBody>
                    <PanelBody title={__("Scheduled event filter")}>
                        <PanelRow>
                            <CheckboxControl
                                label={__('Filter by scheduled date')}
                                checked={scheduledFilter}
                                onChange={() => setAttributes({ scheduledFilter: !scheduledFilter })} />
                        </PanelRow>
                        {scheduledFilter &&
                            <SelectControl
                                label={__('Filter past/upcoming posts:')}
                                value={scheduledFilterStore}
                                onChange={(scheduledFilterStore) => {
                                    setAttributes({ scheduledFilterStore })
                                }}
                                options={[
                                    { label: 'Past posts', value: 'past' },
                                    { label: 'Upcoming posts', value: 'upcoming' }
                                ]}
                            />}
                    </PanelBody>
                </InspectorControls>


                <ResizableBox
                    size={{ height }}
                    style={{ "margin": "auto", width: "100%" }}
                    minHeight="200"
                    minWidth="100"
                    enable={{
                        top: false,
                        right: false,
                        bottom: true,
                        left: false,
                        topRight: true,
                        bottomRight: false,
                        bottomLeft: false,
                        topLeft: false,
                    }}
                    onResizeStop={(event, direction, elt, delta) => {
                        setAttributes({
                            height: parseInt(height + delta.height, 10),
                        });
                        toggleSelection(true);
                    }}
                    onResizeStart={() => {
                        toggleSelection(false);
                    }}>
                    <div style={divStyles}>
                        <iframe style={divStyles} scrolling={"no"}
                                src={this.state.react_ui_url + "/en/embeddable/postscarousel?" + queryString} />
                    </div>
                </ResizableBox>


            </div>
        );

    }
}

const getNumberOfZeroIfEmpty = (num) =>
    num === "" || isNaN(num) ? 0 : parseInt(num)
const Edit = (props) => {
    const blockProps = useBlockProps({ className: 'wp-react-component' });
    return <div {...blockProps}><BlockEdit {...props} /></div>;

}
export default Edit;

