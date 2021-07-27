import {Component} from '@wordpress/element'
import {InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {Panel, PanelBody, PanelRow, SelectControl,TextControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';

class BlockEdit extends Component {
    constructor(props) {
        super(props);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    render() {
        const {
            className, isSelected,
            toggleSelection, setAttributes, attributes: {
                icon
            }
        } = this.props;
        const queryString = `data-icon=${icon}&editing=true`
        const divStyles = {}
        return (
            [isSelected && (
                <InspectorControls>
                    <Panel header={__("Share Configuration")}>
                        <PanelBody>
                            <PanelRow>
                                <TextControl
                                    label={__('Icon')}
                                    value={icon}
                                    onChange={(icon) => setAttributes({icon})}
                                />
                            </PanelRow>
                        </PanelBody>
                    </Panel>
                </InspectorControls>
            ), (
                <div>
                    <iframe
                        id={"id_description_iframe"}
                        onLoad={e=>this.iframeLoaded()}
                        scrolling={"no"}
                        style={divStyles}
                        src={process.env.EMBEDDABLE_URI + "/share?" + queryString}
                    />
                </div>
            )]
        );
    }
}

const Edit = (props) => {
    const blockProps = useBlockProps();
    return <div {...blockProps}><BlockEdit {...props}/></div>;
}

export default Edit;