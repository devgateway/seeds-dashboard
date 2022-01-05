import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Panel, PanelBody, PanelRow, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BaseBlockEdit, ConnectFilterConfig, SizeConfig } from '../commons/index'

class BlockEdit extends BaseBlockEdit {

  render() {
    const {
      className, isSelected, setAttributes,
      attributes: {
        height = 327, width = 286,
        connectFilter,
        valuesFilterStore,
        selectedFilterStore
      }
    } = this.props;

    let queryString = `data-height=${height}`;
    queryString += `&data-connect-filter=${connectFilter}`;
    queryString += `&data-values-filter-store=${valuesFilterStore}`;
    queryString += `&data-selected-filter-store=${selectedFilterStore}`;

    queryString += `data-width=${width}`;

    queryString += `&editing=true`;
    const divStyles = { height: height + 'px', width: '100%' }
    return ([isSelected && (<InspectorControls>
        <Panel header={__("Image Map Configuration")}>
          <PanelBody>
            <PanelRow>
              <RangeControl
                label={__('Map Width')}
                value={width}
                onChange={(width) => setAttributes({ width })}
                min={1}
                max={1000}
              /></PanelRow>
            <PanelRow>
              <RangeControl
                label={__('map height')}
                value={height}
                onChange={(height) => setAttributes({ height })}
                min={1}
                max={1000}
              /></PanelRow>
          </PanelBody>
          <ConnectFilterConfig
            setAttributes={setAttributes}
            connectFilter={connectFilter}
            valuesFilterStore={valuesFilterStore}
            selectedFilterStore={selectedFilterStore}
            title={"Image map filter configuration"}
          />
        </Panel>
      </InspectorControls>),

        (<div className={className} style={divStyles}>

            <iframe id={"id_description_iframe"} scrolling={"no"}
                    style={divStyles} src={this.state.react_ui_url + "/en/embeddable/imageMap?" + queryString} />
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