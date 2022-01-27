import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
  Panel,
  PanelBody,
  PanelRow,
  ResizableBox,
  TextControl
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
  BaseBlockEdit, SizeConfig,
  ConnectFilterConfig
} from "../commons";


class BlockEdit extends BaseBlockEdit {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      className, isSelected,
      toggleSelection,
      setAttributes,
      attributes: {
        height,
        defaultPage,
        connectFilter,
        valuesFilterStore,
        selectedFilterStore,
      },
    } = this.props;


    let queryString = `editing=true&data-default-page=${defaultPage}`;
    queryString += `&data-connect-filter=${connectFilter}`;
    queryString += `&data-values-filter-store=${valuesFilterStore}`;
    queryString += `&data-selected-filter-store=${selectedFilterStore}`;
    queryString += `&data-height=${height}`;
    const divStyles = { height: height + 'px', width: '100%' }

    return (
      <div>
        <InspectorControls>
          <Panel header={__("Inner page Configuration")}>
            <PanelBody>
              <PanelRow>
                <TextControl
                  label={__('default inner page')}
                  value={defaultPage}
                  onChange={(defaultPage) => setAttributes({ defaultPage })}
                /></PanelRow>
            </PanelBody>
            <SizeConfig initialOpen={false} setAttributes={setAttributes} height={height} />
            <ConnectFilterConfig
              setAttributes={setAttributes}
              connectFilter={connectFilter}
              valuesFilterStore={valuesFilterStore}
              selectedFilterStore={selectedFilterStore}
              title={"Inner page filter configuration"}
            />
          </Panel>
        </InspectorControls>


        <ResizableBox
          size={{ height }}
          style={{ "margin": "auto", width: "100%" }}
          minHeight="200"
          minWidth="100"
          enable={{
            top: false,
            right: false,
            bottom: true,
            left: false,
            topRight: true,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          onResizeStop={(event, direction, elt, delta) => {
            setAttributes({
              height: parseInt(height + delta.height, 10),
            });
            toggleSelection(true);
          }}
          onResizeStart={() => {
            toggleSelection(false);
          }}>
          <div style={divStyles}>
            <iframe style={divStyles} scrolling={"no"}
                    src={this.state.react_ui_url + "/en/embeddable/innerPage?" + queryString} />
          </div>
        </ResizableBox>


      </div>
    );

  }
}

const Edit = (props) => {
  const blockProps = useBlockProps({ className: 'wp-react-component' });
  return <div {...blockProps}><BlockEdit {...props} /></div>;

}
export default Edit;

