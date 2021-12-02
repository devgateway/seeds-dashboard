import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
  __experimentalNumberControl as NumberControl,
  Panel,
  PanelBody,
  PanelRow,
  ResizableBox,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BlockEditWithFilters, SizeConfig } from "../commons";


class BlockEdit extends BlockEditWithFilters {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      className, isSelected,
      toggleSelection,
      setAttributes,
      attributes: {
        count,
        type,
        taxonomy,
        categories,
        height = 650,
        itemsPerPage
      },
    } = this.props;


    let queryString = `editing=true&data-type=${type}`
    queryString += `&data-taxonomy=${taxonomy}`;
    queryString += `&data-categories=${categories}`;
    queryString += `&data-items=${count}`;
    queryString += `&data-items-per-page=${itemsPerPage}`;

    const divStyles = { height: height + 'px', width: '100%' }

    return (
      <div>
        <InspectorControls>
          <Panel header={__("Carousel Configuration")}>
            <PanelBody>
              <PanelRow>
                <NumberControl
                  isShiftStepEnabled={true}
                  onChange={(count) => setAttributes({ count })}
                  shiftStep={10}
                  value={count}
                  label={__("Items")} />
              </PanelRow>
              <PanelRow>
                <NumberControl
                  isShiftStepEnabled={true}
                  onChange={(itemsPerPage) => setAttributes({ itemsPerPage })}
                  shiftStep={10}
                  value={itemsPerPage}
                  label={__("items per page")} />
              </PanelRow>
            </PanelBody>
            <SizeConfig initialOpen={false} setAttributes={setAttributes} height={height}></SizeConfig>
            {this.renderFilters()}
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
                    src={this.state.react_ui_url + "/en/embeddable/postscarousel?" + queryString} />
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

