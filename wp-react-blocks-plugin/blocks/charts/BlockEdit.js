import { Component } from '@wordpress/element'
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
  Panel,
  PanelBody,
  PanelRow,
  ResizableBox,
  SelectControl,
  RangeControl,
  TextControl,
  ToggleControl
} from '@wordpress/components';
import { InnerBlocks } from '@wordpress/editor'; // or wp.editor
import { __ } from '@wordpress/i18n';
import { Checkbox } from 'semantic-ui-react'
import { BaseBlockEdit } from "../commons";

class BlockEdit extends BaseBlockEdit {
  render() {
    const {
      className, isSelected,
      toggleSelection, setAttributes, attributes: {
        height,
        width,
        type,
        dualMode,
        mode,
        download
      }
    } = this.props;
    let queryString = `data-height=${height}`;
    queryString += `&data-chart-type=${type}`;
    queryString += `&data-dualmode=${dualMode}`;
    queryString += `&data-download=${download}`;
    queryString += `&editing=true`
    const divStyles = { height: height + 'px', width: '100%' }
    return (
      [isSelected && (
        <InspectorControls>
          <Panel header={__("Chart Configuration")}>
            <PanelBody>
              <PanelRow>
                <SelectControl
                  label={__('Indicator:')}
                  value={[type]}
                  onChange={(type) => {
                    setAttributes({ type })
                  }}
                  options={[
                    { label: 'Country Info', value: 'countryInfo' },
                    { label: 'Number of varieties released in last 3 years', value: 'numberOfVarietiesReleasedLast3Years' }
                  ]}
                />
              </PanelRow>
              <PanelRow>
                <ToggleControl
                  label={__("Use Infographic")}
                  checked={dualMode}
                  onChange={(dualMode) => setAttributes({ dualMode })}
                />
              </PanelRow>
              <PanelRow>
                <ToggleControl
                  label={__("Download chart")}
                  checked={download}
                  onChange={(download) => setAttributes({ download })}
                />
              </PanelRow>

              <PanelRow>
                <RangeControl
                  label={__('Chart Width')}
                  value={width}
                  onChange={(width) => setAttributes({ width })}
                  min={1}
                  max={1000}
                /></PanelRow>
              <PanelRow>
                <RangeControl
                  label={__('Chart height')}
                  value={height}
                  onChange={(height) => setAttributes({ height })}
                  min={1}
                  max={1000}
                /></PanelRow>
            </PanelBody>
          </Panel>
        </InspectorControls>
      ), (
        <ResizableBox
          size={{ height, width }}
          style={{ "margin": "auto" }}
          minHeight="50"
          minWidth="50"
          enable={{
            top: false,
            right: true,
            bottom: true,
            left: false,
            topRight: false,
            bottomRight: true,
            bottomLeft: false,
            topLeft: false,
          }}
          onResizeStop={(event, direction, elt, delta) => {
            setAttributes({
              height: parseInt(height + delta.height, 10),
              width: parseInt(width + delta.width, 10),
            });
            toggleSelection(true);
          }}
          onResizeStart={() => {
            toggleSelection(false);
          }}
        >
          <div className={className} style={divStyles}>
            <div>
              {
                dualMode &&
                <Checkbox
                  toggle
                  defaultChecked={true}
                  onChange={e => setAttributes({ mode: (mode == 'chart' ? 'info' : 'chart') })}
                />
              }
            </div>
            {
              mode == "chart" &&
              <div>
                <iframe id={"id_description_iframe"}  scrolling={"no"}
                        style={divStyles} src={this.state.react_ui_url + "/en/embeddable/chart?" + queryString} />
              </div>
            }
            {
              mode == "info" &&
              <div className={"inner block"}>
                <InnerBlocks />
              </div>
            }
          </div>
        </ResizableBox>
      )]);
  }
}

const Edit = (props) => {
  const blockProps = useBlockProps();
  return <div {...blockProps}><BlockEdit {...props} /></div>;
}

export default Edit;
