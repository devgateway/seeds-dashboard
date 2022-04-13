import { useBlockProps } from '@wordpress/block-editor';
//import { getReferenceByDistinctEdits } from '@wordpress/core';

const SaveComponent = (props) => {

  const {
    attributes: {
      eventLocation,
      eventStartDate,
      eventEndDate,
      hostedBy,
      link, 
      name
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
         data-event-end-date={eventEndDate}
         data-event-hosted-by={hostedBy}
         data-event-link={link}
         data-event-name={name}
    >
    </div>
  );
}


export default SaveComponent
