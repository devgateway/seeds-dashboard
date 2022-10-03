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
                mode,
                type,
                title_en,
                title_fr,
                sourceText_en,
                sourceText_fr,
            }
        } = this.props;
        let queryString = `&data-map-type=${type}`;
        queryString += `&data-title=${title_en}`;
        queryString += `&data-title=${title_fr}`;
        queryString += `&data-source-text_en=${sourceText_en}`;
        queryString += `&data-source-text_fr=${sourceText_fr}`;
        queryString += ` & editing = true`;
        return (
            [isSelected && (
                <InspectorControls>
                    <Panel header={__("Map Configuration")}>
                        <PanelBody>
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
                        </PanelBody>
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
                            {
                                <Checkbox
                                    toggle
                                    defaultChecked={true}
                                    onChange={e => setAttributes({ mode: (mode === 'map' ? 'info' : 'map') })}
                                />
                            }
                        </div>
                        {
                            mode === "map" &&
                            <div>
                                <iframe id={"id_description_iframe"} scrolling={"no"}
                                        style={divStyles}
                                        src={this.state.react_ui_url + "/en/embeddable/map?" + queryString} />
                            </div>
                        }
                        {
                            mode === "info" &&
                            <div className={"inner block"}>
                                <InnerBlocks />
                            </div>
                        }
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
