import {InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {Panel, PanelBody, PanelRow, SelectControl, CheckboxControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {BaseBlockEdit} from '../commons/index'

class BlockEdit extends BaseBlockEdit {

    render() {
        const {
            className, isSelected,
            toggleSelection, setAttributes, attributes: {
                type, showInline, category
            }
        } = this.props;

        let queryString = `data-type=${type}`;
        queryString += `&data-show-inline=${showInline}`;
        queryString += `&data-category=${category}`;
        queryString += `&editing=true`;
        const divStyles = {}
        return ([isSelected && (<InspectorControls>
                <Panel header={__("List of Documents Configuration")}>
                    <PanelBody>
                        <PanelRow>
                            <SelectControl
                                label={__('Type:')}
                                value={[type]} // e.g: value = [ 'a', 'c' ]
                                onChange={(value) => {
                                    setAttributes({type: value})
                                }}
                                options={[
                                    {label: 'PDF', value: 'PDF'}
                                ]}
                            />
                        </PanelRow>
                        <PanelRow>
                            <PanelBody>
                                {this.generateCategories(category)}
                            </PanelBody>
                        </PanelRow>
                        <PanelRow>
                            <CheckboxControl
                                label={__('Show Inline')}
                                checked={showInline}
                                onChange={() => setAttributes({showInline: !showInline})}/>
                        </PanelRow>
                    </PanelBody>
                </Panel>
            </InspectorControls>),
                (<div>
                        <iframe id={"id_description_iframe"} scrolling={"no"}
                                style={divStyles}
                                src={this.state.react_ui_url + "/en/embeddable/listOfDocuments?" + queryString}/>
                    </div>
                )]
        );
    }

    generateCategories = (category) => {
        const {setAttributes} = this.props;
        const {categories} = this.state;
        const list = categories.filter(i => i.parent === 0)
            .sort(i => i.name.toLowerCase())
            .map(i => {
                return {label: i.name, value: i.id};
            });
        list.push({label: __('Select one category'), value: 0});
        return (<SelectControl
            label={__('Category:')}
            value={[category]} // e.g: value = [ 'a', 'c' ]
            onChange={(value) => {
                // alert(category + " - " + value);
                setAttributes({category: Number(value)})
            }}
            options={list}
        />)
    }
}

const Edit = (props) => {
    const blockProps = useBlockProps({className: 'wp-react-component'});
    return <div {...blockProps}><BlockEdit {...props} /></div>;
}

export default Edit;
