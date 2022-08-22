import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Panel, PanelBody, PanelRow, SelectControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BaseBlockEdit } from '../commons/index'

class BlockEdit extends BaseBlockEdit {

    render() {
        const {
            className, isSelected,
            toggleSelection, setAttributes, attributes: {
                behavior, label
            }
        } = this.props;

        const queryString = `data-behavior=${behavior}&data-label=${label}&editing=true`;
        const divStyles = {};
        return ([isSelected && (<InspectorControls>
                <Panel header={__("Section Configuration")}>
                    <PanelBody>
                        <PanelRow>
                            <SelectControl
                                label={__('Behavior:')}
                                value={[behavior]} // e.g: value = [ 'a', 'c' ]
                                onChange={(behavior) => {
                                    setAttributes({ behavior })
                                }}
                                options={[
                                    { label: 'Smooth', value: 'smooth' },
                                    { label: 'Auto', value: 'auto' }
                                ]}
                            />
                        </PanelRow>
                        <PanelRow>
                            <TextControl
                                label={__('Label')}
                                value={label}
                                onChange={(label) => setAttributes({ label })}
                            /></PanelRow>
                    </PanelBody>
                </Panel>
            </InspectorControls>),

                (<div>
                        <iframe id={"id_description_iframe"} onLoad={e => this.iframeLoaded()} scrolling={"no"}
                                style={divStyles}
                                src={this.state.react_ui_url + "/en/embeddable/backToTop?" + queryString} />
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