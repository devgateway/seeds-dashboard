import {InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {Panel, PanelBody, PanelRow, SelectControl, TextControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';
import {BaseBlockEdit} from '../commons/index'

class BlockEdit extends BaseBlockEdit {

    render() {
        const {
            className, isSelected, toggleSelection, setAttributes, attributes: {
                description, country, year, image, language
            }
        } = this.props;

        let queryString = `data-description=${description}`;
        queryString += `&data-country=${country}`;
        queryString += `&data-language=${language}`;
        queryString += `&data-year=${year}`;
        queryString += `&data-image=${image}`
        queryString += `&editing=true`;
        const divStyles = {}
        return ([isSelected && (<InspectorControls>
            <Panel header={__("Country Report Configuration")}>
                <PanelBody>
                    <PanelRow>
                        {this.getCategoryValues('languages', 'Language', language, 'language')}
                    </PanelRow>
                    <PanelRow>
                        <TextControl
                            label={__('Description:')}
                            value={description}
                            onChange={(description) => setAttributes({description})}
                        />
                    </PanelRow>
                </PanelBody>
            </Panel>
        </InspectorControls>), (<div>
            <iframe id={"id_description_iframe"} scrolling={"no"}
                    style={divStyles}
                    src={this.state.react_ui_url + "/en/embeddable/countryReports?" + queryString}/>
        </div>)]);
    }

    getCategoryValues = (category, title, val, key) => {
        console.log(val);
        const {setAttributes} = this.props;
        const {categories} = this.state;
        let list = [];
        list.push({label: '', value: -1});
        if (categories) {
            const parent = categories.find(i => i.slug === category);
            categories.filter(i => i.parent === parent.id)
                .sort(i => i.name.toLowerCase())
                .map(i => {
                    return {label: i.name, value: i.id};
                }).forEach(i => {
                list.push(i);
            });
        }
        return (<SelectControl
            label={__(title)}
            value={val} // e.g: value = [ 'a', 'c' ]
            onChange={(value) => {
                console.log(value);
                setAttributes({[key]: value})
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
