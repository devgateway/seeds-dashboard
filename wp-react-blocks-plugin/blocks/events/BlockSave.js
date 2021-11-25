import { useBlockProps } from '@wordpress/block-editor';
//import { getReferenceByDistinctEdits } from '@wordpress/core';

const SaveComponent = (props) => {

  const {
    attributes: {
      eventLocation,
      eventStartDate
    }
  } = props;

  const blockProps = useBlockProps.save({
    className: 'wp-react-lib component chart'
  });

  const divClass = {}
  const divStyles = {}
  return (
    <div className={"wp-react-lib-component"}
         data-component={"events"}
         data-event-location={eventLocation}
         data-event-start-date={eventStartDate}
    >
    </div>
  );
}


export default SaveComponent
