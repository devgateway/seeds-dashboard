import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/editor';

const SaveComponent = (props) => {
  const {
    toggleSelection, setAttributes, attributes: {
      height,
      width,
      type,
      dualMode,
      download
    }
  } = props;
  const blockProps = useBlockProps.save({
    className: 'wp-react-lib component chart'
  });
  const divClass = {}
  const divStyles = {}
  return (
    <div className={"wp-react-lib-component"}
         data-component={"chart"}
         data-height={height}
         data-width={width}
         data-chart-type={type}
         data-dualMode={dualMode}
         data-download={download}
    />
  );
}

export default SaveComponent