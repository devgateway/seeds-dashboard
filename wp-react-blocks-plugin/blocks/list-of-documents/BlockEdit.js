import {InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {Panel, PanelBody, PanelRow, SelectControl, TextControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {BaseBlockEdit} from '../commons/index'

class BlockEdit extends BaseBlockEdit {

    render() {
        const {
            className, isSelected,
            toggleSelection, setAttributes, attributes: {
                type, showInline, category, noDataText
            }
        } = this.props;

        let queryString = `data-type=${type}`;
        queryString += `&data-show-inline=${showInline}`;
        queryString += `&data-category=${category}`;
        queryString += `&data-no-data-text=${noDataText}`;
        queryString += `&editing=true`;
        const divStyles = {}
        return ([isSelected && (<InspectorControls>
                <Panel header={__("List of Documents Configuration")}>
                    <PanelBody>
                        <PanelRow>
                            {this.generateCategories(category)}
                        </PanelRow>
                        <PanelRow>
                            <TextControl
                                label={__('No Data Text:')}
                                value={noDataText}
                                onChange={(noDataText) => setAttributes({noDataText})}
                            />
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
        let list = [];
        list.push({label: __('Select one category'), value: 0});
        if (categories) {
            categories.filter(i => i.parent === 0)
                .sort(i => i.name.toLowerCase())
                .map(i => {
                    return {label: i.name, value: i.id};
                }).forEach(i => {
                list.push(i);
            });
        }
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
