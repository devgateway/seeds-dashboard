import {Component} from '@wordpress/element'
import {InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {
    Panel,
    PanelBody,
    PanelRow,
    ResizableBox,
    SelectControl,
    RangeControl,
    TextControl,
    ToggleControl,
    TextareaControl
} from '@wordpress/components';
import {InnerBlocks} from '@wordpress/editor'; // or wp.editor
import {__} from '@wordpress/i18n';
import {Checkbox} from 'semantic-ui-react'
import {BaseBlockEdit} from "../commons";

class BlockEdit extends BaseBlockEdit {
    render() {
        const {
            className, isSelected,
            toggleSelection, setAttributes, attributes: {
                height,
                width,
                type,
                title,
                sourceText_en,
                sourceText_fr,
                methodology,
                download
            }
        } = this.props;
        let queryString = `data-height=${height}`;
        queryString += `&data-map-type=${type}`;
        queryString += `&data-title=${title}`;
        queryString += `&data-source-text_en=${sourceText_en}`;
        queryString += `&data-source-text_fr=${sourceText_fr}`;
        queryString += `&data-methodology=${methodology}`;
        queryString += `&data-download=${download}`;
        queryString += ` & editing = true`;
        const divStyles = { height: height + 'px', width: '100%' }
        return (
            [isSelected && (
                <InspectorControls>
                    <Panel header={__("Map Configuration")}>
                        <PanelBody>
                            <PanelRow>
                                <TextControl label={__('Chart title')} value={title}
                                             onChange={(title) => setAttributes({ title })} />
                            </PanelRow>
                            <PanelRow>
                                <SelectControl
                                    label={__('Type:')}
                                    value={[type]}
                                    onChange={(type) => {
                                        setAttributes({type})
                                    }}
                                    options={[
                                        {label: 'Research and Development', value: 'indicators_A'},
                                        {label: 'Industry Competitiveness', value: 'indicators_B'},
                                        {label: 'Seed Policy and Regulations', value: 'indicators_C'},
                                        {label: 'Institutional Support', value: 'indicators_D'},
                                        {label: 'Service to Smallholder Farmers', value: 'indicators_E'}
                                    ]}
                                />
                            </PanelRow>
                            <PanelRow>
                                <RangeControl
                                    label={__('Map Width')}
                                    value={width}
                                    onChange={(width) => setAttributes({ width })}
                                    min={1}
                                    max={1000}
                                />
                            </PanelRow>
                            <PanelRow>
                                <RangeControl
                                    label={__('Map height')}
                                    value={height}
                                    onChange={(height) => setAttributes({ height })}
                                    min={1}
                                    max={1000}
                                />
                            </PanelRow>
                            <PanelRow>
                                <TextControl label={__('Methodology')} value={methodology}
                                             onChange={(methodology) => setAttributes({ methodology })} />
                            </PanelRow>
                            <PanelRow>
                                <ToggleControl
                                    label={__("Download chart")}
                                    checked={download}
                                    onChange={(download) => setAttributes({ download })}
                                />
                            </PanelRow>
                        </PanelBody>
                        <PanelRow>
                            <TextareaControl
                                label={__('Source in English (it can be HTML)')}
                                value={sourceText_en}
                                onChange={(sourceText_en) => setAttributes({ sourceText_en })}
                            />
                        </PanelRow>
                        <PanelRow>
                            <TextareaControl
                                label={__('Source in French (it can be HTML)')}
                                value={sourceText_fr}
                                onChange={(sourceText_fr) => setAttributes({ sourceText_fr })}
                            />
                        </PanelRow>
                    </Panel>
                </InspectorControls>
            ), (
                <ResizableBox
                    size={{height, width}}
                    style={{"margin": "auto"}}
                    minHeight="50"
                    minWidth="50"
                    enable={{
                        top: false,
                        right: true,
                        bottom: true,
                        left: false,
                        topRight: false,
                        bottomRight: true,
                        bottomLeft: false,
                        topLeft: false,
                    }}
                    onResizeStop={(event, direction, elt, delta) => {
                        setAttributes({
                            height: parseInt(height + delta.height, 10),
                            width: parseInt(width + delta.width, 10),
                        });
                        toggleSelection(true);
                    }}
                    onResizeStart={() => {
                        toggleSelection(false);
                    }}>
                    <div className={className}>
                        <div>
                            <iframe id={"id_description_iframe"} scrolling={"no"}
                                    style={divStyles}
                                    src={this.state.react_ui_url + "/en/embeddable/map?" + queryString}/>
                        </div>
                    </div>
                </ResizableBox>
            )]);
    }
}

const Edit = (props) => {
    const blockProps = useBlockProps();
    return <div {...blockProps}><BlockEdit {...props} /></div>;
}

export default Edit;
