import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Panel, PanelBody, PanelRow, SelectControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BaseBlockEdit } from '../commons/index'

const alignments = [
    { label: 'Middle', value: 'middle' },
    { label: 'Right', value: 'right' },
    { label: 'Left', value: 'left' }
];

class BlockEdit extends BaseBlockEdit {

    render() {
        const {
            className, isSelected,
            toggleSelection, setAttributes, attributes: {
                title,
                numberLabel,
                ratingLabel,
                ratingAlignment,
                numberAlignment,
                ratingMinimumFractionDigits,
                ratingMaximumFractionDigits,
                numberMinimumFractionDigits,
                numberMaximumFractionDigits
            }
        } = this.props;

        let queryString = `data-title=${title}&editing=true`;
        queryString += `&data-rating-label=${ratingLabel}`;
        queryString += `&data-number-label=${numberLabel}`;
        queryString += `&data-rating-alignment=${ratingAlignment}`;

        queryString += `&data-rating-minimum-fraction-digits=${ratingMinimumFractionDigits}`;
        queryString += `&data-rating-maximum-fraction-digits=${ratingMaximumFractionDigits}`;

        queryString += `&data-number-minimum-fraction-digits=${numberMinimumFractionDigits}`;
        queryString += `&data-number-maximum-fraction-digits=${numberMaximumFractionDigits}`;
        queryString += `&data-number-alignment=${numberAlignment}`;
        const divStyles = { height: '1000' + 'px', width: '100%' }
        return ([isSelected && (<InspectorControls>
                    <Panel header={__("Section Configuration")}>
                        <PanelBody>
                            <PanelRow>
                                <TextControl
                                    label={__('Title:')}
                                    value={title}
                                    onChange={(title) => setAttributes({ title })}
                                /></PanelRow>
                            <PanelRow>
                                <TextControl
                                    label={__('Rating Label:')}
                                    value={ratingLabel}
                                    onChange={(ratingLabel) => setAttributes({ ratingLabel })}
                                />
                            </PanelRow>
                            <SelectControl
                                label={__('Rating alignment:')}
                                value={[ratingAlignment]}
                                onChange={(ratingAlignment) => {
                                    setAttributes({ ratingAlignment })
                                }}
                                options={alignments}
                            />
                            <NumberFormat bodyTitle={'Rating number format'} setAttributes={setAttributes}
                                          minimumFractionDigits={ratingMinimumFractionDigits}
                                          minimumFractionDigitsProperty={'ratingMinimumFractionDigits'}
                                          maximumFractionDigits={ratingMaximumFractionDigits}
                                          maximumFractionDigitsProperty={'ratingMaximumFractionDigits'}
                            />
                            <PanelRow>
                                <TextControl
                                    label={__('Number label:')}
                                    value={numberLabel}
                                    onChange={(numberLabel) => setAttributes({ numberLabel })}
                                />
                            </PanelRow>
                            <PanelRow>
                                <SelectControl
                                    label={__('Number alignment:')}
                                    value={[numberAlignment]}
                                    onChange={(numberAlignment) => {
                                        setAttributes({ numberAlignment })
                                    }}
                                    options={alignments}
                                /></PanelRow>
                            <NumberFormat bodyTitle={'Number number format'} setAttributes={setAttributes}
                                          minimumFractionDigits={numberMinimumFractionDigits}
                                          minimumFractionDigitsProperty={'numberMinimumFractionDigits'}
                                          maximumFractionDigits={numberMaximumFractionDigits}
                                          maximumFractionDigitsProperty={'numberMaximumFractionDigits'}
                            />
                        </PanelBody>
                    </Panel>
                </InspectorControls>
            ),

                (
                    <div className={className} style={divStyles}>
                        <div>
                            <iframe id={"id_description_iframe"} onLoad={e => this.iframeLoaded()}
                                    style={divStyles}
                                    src={this.state.react_ui_url + "/en/embeddable/dataSummary?" + queryString} />
                        </div>
                    </div>
                )]
        );

    }
}

const NumberFormat = ({
                          bodyTitle,
                          minimumFractionDigits,
                          minimumFractionDigitsProperty,
                          maximumFractionDigits,
                          maximumFractionDigitsProperty,
                          setAttributes,
                      }) => {

    return <PanelBody title={__(bodyTitle)}>
        <PanelRow>
            <TextControl label={__('Minimum fraction digits')} value={minimumFractionDigits}
                         onChange={(minimumFractionDigits) => setAttributes({
                             [minimumFractionDigitsProperty]: minimumFractionDigits
                         })} />
        </PanelRow>
        <PanelRow>
            <TextControl label={__('Maximum fraction digits')} value={maximumFractionDigits}
                         onChange={(maximumFractionDigits) => setAttributes({ [maximumFractionDigitsProperty]: maximumFractionDigits })} />
        </PanelRow>
        {/*<PanelRow>
            <TextControl label={__('Chart sub title')} value={subTitle}
                         onChange={(subTitle) => setAttributes({ subTitle })} />
        </PanelRow>
            <PanelRow>
            <TextControl label={__('Source')} value={sources}
            onChange={(sources) => setAttributes({sources})} />
            </PanelRow>
            <PanelRow>
            <ToggleControl
            label={__("Add category as source")}
            checked={useSourceByCategory}
            onChange={(useSourceByCategory) => setAttributes({useSourceByCategory})}
            />
            </PanelRow>
            <PanelRow>
            <TextControl label={__('Methodology')} value={methodology}
            onChange={(methodology) => setAttributes({methodology})} />
            </PanelRow>*/}
    </PanelBody>

}

const Edit = (props) => {

    const blockProps = useBlockProps({ className: 'wp-react-component' });
    return <div {...blockProps}><BlockEdit {...props} /></div>;


}
export default Edit;