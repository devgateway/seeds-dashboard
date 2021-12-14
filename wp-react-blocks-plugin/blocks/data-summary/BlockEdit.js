import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Panel, PanelBody, PanelRow, SelectControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BaseBlockEdit } from '../commons/index'

class BlockEdit extends BaseBlockEdit {

  render() {
    const {
      className, isSelected,
      toggleSelection, setAttributes, attributes: {
        type
      }
    } = this.props;

    const queryString = `data-type=${type}&editing=true`
    const divStyles = {}
    return ([isSelected && (<InspectorControls>
        <Panel header={__("Section Configuration")}>
          <PanelBody>
            <PanelRow>
              <SelectControl
                label={__('Type:')}
                value={[type]} // e.g: value = [ 'a', 'c' ]
                onChange={(value) => {
                  setAttributes({ type: value })
                }}
                options={[
                  { label: 'Heading', value: 'heading' },
                  { label: 'Body', value: 'body' }
                ]}
              />
            </PanelRow>
          </PanelBody>
        </Panel>
      </InspectorControls>),

        (<div>
            <iframe id={"id_description_iframe"} onLoad={e => this.iframeLoaded()} scrolling={"no"}
                    style={divStyles} src={this.state.react_ui_url + "/en/embeddable/dataSummary?" + queryString} />
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