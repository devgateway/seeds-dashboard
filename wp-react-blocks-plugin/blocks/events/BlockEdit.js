import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
    Panel,
    PanelBody,
    PanelRow,
    DateTimePicker,
    TextControl
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BaseBlockEdit } from '../commons/index'

class BlockEdit extends BaseBlockEdit {
    render() {
        const {
            className, isSelected,
            toggleSelection, setAttributes, attributes: {
            }
        } = this.props;

        let queryString = `editing=true`;
        const divStyles = {};
        return ([isSelected && (<InspectorControls>
                <Panel header={__("Events")}>
                    <PanelBody>
                        <PanelRow>
                            <label>{__('Event viewer')}</label>
                        </PanelRow>
                    </PanelBody>
                </Panel>
            </InspectorControls>),

                (<div>
                        <iframe id={"id_description_iframe"} scrolling={"no"}
                                style={divStyles}
                                src={this.state.react_ui_url + "/en/embeddable/events?" + queryString} />
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
