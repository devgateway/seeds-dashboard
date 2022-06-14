import { useBlockProps } from '@wordpress/block-editor';

const SaveComponent = (props) => {

  const {
    attributes: {
      viewportMessage,
      viewportHeight,
      viewportWidth
    }
  } = props;

  const blockProps = useBlockProps.save({
    className: 'wp-react-lib component viewportMessage'
  });

  const divClass = {}
  const divStyles = {}
  return (
    <div className={"wp-react-lib-component"}
         data-component={"viewportMessage"}
         data-viewport-message={viewportMessage}
         data-viewport-width={viewportWidth}
         data-viewport-height={viewportHeight}
    >
    </div>
  );
}


export default SaveComponent
