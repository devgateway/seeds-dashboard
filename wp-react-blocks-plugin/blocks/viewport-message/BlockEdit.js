import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
  Panel,
  PanelBody,
  PanelRow,
  TextControl
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BaseBlockEdit } from '../commons/index'

class BlockEdit extends BaseBlockEdit {
  render() {
    const {
      className, isSelected,
      toggleSelection, setAttributes, attributes: {
        viewportMessage,
        viewportHeight,
        viewportWidth
      }
    } = this.props;

    let queryString = `data-viewport-message=${viewportMessage}`;
    queryString += `&data-viewport-width=${viewportWidth}`;
    queryString += `&data-viewport-height=${viewportHeight}&editing=true`;
    const divStyles = {};
    return ([isSelected && (<InspectorControls>
        <Panel header={__("Message Configuration")}>
          <PanelBody>
            <PanelRow>
              <label>{__('Configure Error/Warn Message')}</label>
            </PanelRow>
            <PanelRow>
              <TextControl
                  label={__('Message to show when screen is too small')}
                  value={viewportMessage}
                  onChange={(viewportMessage) => setAttributes({ viewportMessage })}
              />
            </PanelRow>
            <PanelRow>
              <RangeControl
                  label={__('Minimum Width')}
                  value={viewportWidth}
                  onChange={(viewportWidth) => setAttributes({viewportWidth})}
                  min={1}
                  max={1200}
              /></PanelRow>
            <PanelRow>
              <RangeControl
                  label={__('Minimum Height')}
                  value={viewportHeight}
                  onChange={(viewportHeight) => setAttributes({viewportHeight})}
                  min={1}
                  max={1000}
              /></PanelRow>
          </PanelBody>
        </Panel>
      </InspectorControls>),

        (<div>
            <iframe id={"id_description_iframe"} scrolling={"no"}
                    style={divStyles} src={this.state.react_ui_url + "/en/embeddable/viewportMessage?" + queryString} />
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