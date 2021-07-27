import {Component} from '@wordpress/element'
import {InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {Panel, PanelBody, PanelRow, SelectControl,TextControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';

class BlockEdit extends Component {
    constructor(props) {
        super(props);
        this.icons = [
            {value: 'print', label: 'Print'},
            {value: 'image', label: 'Image'},
            {value: 'image outline', label: 'Image outline'},
            {value: 'images', label: 'Images'},
            {value: 'images outline', label: 'Images outline'},
            {value: 'download', label: 'Download'},
            {value: 'arrow alternate circle down', label: 'Arrow down'}
        ]
        this.sizes = [
            {value: 'mini', label: 'Mini'},
            {value: 'tiny', label: 'Tiny'},
            {value: 'small', label: 'Small'},
            {value: 'large', label: 'Large'},
            {value: 'big', label: 'Big'},
            {value: 'huge', label: 'Huge'},
            {value: 'massive', label: 'Massive'}
        ]
        this.colors = [
            {value: 'grey', label: 'Grey'},
            {value: 'black', label: 'Black'},
            {value: 'red', label: 'Red'},
            {value: 'orange', label: 'Orange'},
            {value: 'yellow', label: 'Yellow'},
            {value: 'olive', label: 'Olive'},
            {value: 'green', label: 'Green'},
            {value: 'teal', label: 'Teal'},
            {value: 'blue', label: 'Blue'},
            {value: 'violet', label: 'Violet'},
            {value: 'purple', label: 'Purple'},
            {value: 'pink', label: 'Pink'},
            {value: 'brown', label: 'Brown'}
        ]
    }
    render() {
        const {
            className, isSelected,
            toggleSelection, setAttributes, attributes: {
                icon,
                htmlId,
                size,
                color,
                downloadName
            }
        } = this.props;
        const queryString = `data-icon=${icon}&data-id=${htmlId}&data-size=${size}&data-downloadName=${downloadName}&data-color=${color}&editing=true`
        const divStyles = {}
        return ([
            isSelected &&
            (
                <InspectorControls>
                    <Panel header={__("Print Configuration")}>
                        <PanelBody>
                            <PanelRow>
                                <SelectControl
                                    label={__('Icon:')}
                                    value={[icon]} // e.g: value = [ 'a', 'c' ]
                                    onChange={(value) => {
                                        setAttributes({icon: value})
                                    }}
                                    options={this.icons}
                                />
                            </PanelRow>
                            <PanelRow>
                                <TextControl
                                    label={__('Image download name')}
                                    value={downloadName}
                                    onChange={(downloadName) => setAttributes({downloadName})}
                                />
                            </PanelRow>
                            <PanelRow>
                                <SelectControl
                                    label={__('Size:')}
                                    value={[size]} // e.g: value = [ 'a', 'c' ]
                                    onChange={(value) => {
                                        setAttributes({size: value})
                                    }}
                                    options={this.sizes}
                                />
                            </PanelRow>
                            <PanelRow>
                                <SelectControl
                                    label={__('Color:')}
                                    value={[color]} // e.g: value = [ 'a', 'c' ]
                                    onChange={(value) => {
                                        setAttributes({color: value})
                                    }}
                                    options={this.colors}
                                />
                            </PanelRow>
                            <PanelRow>
                                <TextControl
                                    label={__('Html id')}
                                    value={htmlId}
                                    onChange={(htmlId) => setAttributes({htmlId})}
                                />
                            </PanelRow>
                        </PanelBody>
                    </Panel>
                </InspectorControls>
            ),
            (
                <div>
                    <iframe
                        id={"id_description_iframe"}
                        onLoad={e=>this.iframeLoaded()}
                        scrolling={"no"}
                        style={divStyles}
                        src={process.env.EMBEDDABLE_URI + "/print?" + queryString}
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