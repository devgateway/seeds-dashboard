import {Component} from '@wordpress/element'
import {InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {Panel, PanelBody, PanelRow, SelectControl,TextControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';


class BlockEdit extends Component {


    constructor(props) {
        super(props);

        this.crops = [
            {value: 'none', label: 'None'},
            {value: 'cropId', label: 'Filter by crop'}
        ]

    }


    componentDidUpdate(prevProps, prevState, snapshot) {

    }


    render() {
        const {
            className, isSelected,
            toggleSelection, setAttributes, attributes: {
                placeHolder,
                type,
                param
            }
        } = this.props;


        const queryString = `data-type=${type}&data-param=${param}&data-placeholder=${placeHolder}&editing=true`
        const divStyles = {}

        return ([isSelected && (<InspectorControls>
                <Panel header={__("Chart Configuration")}>
                    <PanelBody>
                        <PanelRow>

                            <SelectControl
                                label={__('Type:')}
                                value={[type]} // e.g: value = [ 'a', 'c' ]
                                onChange={(value) => {
                                    setAttributes({type: value})
                                }}
                                options={[
                                    {label: 'Crop', value: 'crop'}]}
                            />

                        </PanelRow>

                        <PanelRow>
                            <SelectControl
                                label={__('Parameter')}
                                value={[param]} // e.g: value = [ 'a', 'c' ]
                                onChange={(value) => {
                                    setAttributes({param: value})
                                }}
                                options={this.crops}
                            />
                        </PanelRow>
                        <PanelRow>
                            <TextControl
                                label={__('Place Holder')}
                                value={placeHolder}
                                onChange={(placeHolder) => setAttributes({placeHolder})}
                            />
                        </PanelRow>
                    </PanelBody>
                </Panel>
            </InspectorControls>),

                (<div>

                        <iframe id={"id_description_iframe"} onLoad={e=>this.iframeLoaded()} scrolling={"no"} style={divStyles}
                                src={process.env.EMBEDDABLE_URI + "/filter?" + queryString}/>

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