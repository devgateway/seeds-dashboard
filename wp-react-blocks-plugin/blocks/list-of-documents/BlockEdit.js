import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Panel, PanelBody, PanelRow, SelectControl, CheckboxControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BaseBlockEdit } from '../commons/index'

class BlockEdit extends BaseBlockEdit {

  render() {
    const {
      className, isSelected,
      toggleSelection, setAttributes, attributes: {
        type, showInline
      }
    } = this.props;

    let queryString = `data-type=${type}`;
    queryString += `&data-show-inline=${showInline}`;
    queryString += `&editing=true`
    const divStyles = {}
    return ([isSelected && (<InspectorControls>
        <Panel header={__("List of Documents Configuration")}>
          <PanelBody>
            <PanelRow>
              <SelectControl
                label={__('Type:')}
                value={[type]} // e.g: value = [ 'a', 'c' ]
                onChange={(value) => {
                  setAttributes({ type: value })
                }}
                options={[
                  { label: 'PDF', value: 'PDF' }
                ]}
              />
            </PanelRow>
            <PanelRow>
              <CheckboxControl
                label={__('Show Inline:')}
                checked={showInline}
                onChange={() => setAttributes({ showInline: !showInline })} />
            </PanelRow>
          </PanelBody>
        </Panel>
      </InspectorControls>),
        (<div>
            <iframe id={"id_description_iframe"} scrolling={"no"}
                    style={divStyles} src={this.state.react_ui_url + "/en/embeddable/listOfDocuments?" + queryString} />
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
