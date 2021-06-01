import {Component} from '@wordpress/element'
import {InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {Panel, PanelBody, PanelRow, SelectControl,TextControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';


class BlockEdit extends Component {


    constructor(props) {
        super(props);
        this.types = [
            {label: 'Crop', value: 'cropId'},
            {label: 'Country', value: 'countryId'}
        ]
        this.crops = [
            {value: 'none', label: 'None'},
            {value: 'bean', label: 'Beans'},
            {value: 'cowpea', label: 'Cowpea'},
            {value: 'groundnut', label: 'Groundnut'},
            {value: 'maize', label: 'Maize'},
            {value: 'millet', label: 'Millet'},
            {value: 'pigeon', label: 'Pigeon pea'},
            {value: 'rice', label: 'Rice'},
            {value: 'sorghum', label: 'Sorghum'},
            {value: 'soya', label: 'Soya bean'},
            {value: 'sunflower', label: 'Sunflower'},
            {value: 'teff', label: 'Teff'},
            {value: 'wheat', label: 'Wheat'}
        ]
        this.multiSelect = [
            {value: 'single', label: 'Single'},
            {value: 'multiple', label: 'Multiple'}
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
                param,
                multi
            }
        } = this.props;


        const queryString = `data-type=${type}&data-param=${param}&data-placeholder=${placeHolder}&data-multi=${multi}&editing=true`
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
                                options={this.types}
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
                            <SelectControl
                                label={__('Single/multiple selection')}
                                value={[multi]} // e.g: value = [ 'a', 'c' ]
                                onChange={(value) => {
                                    setAttributes({multi: value})
                                }}
                                options={this.multiSelect}
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