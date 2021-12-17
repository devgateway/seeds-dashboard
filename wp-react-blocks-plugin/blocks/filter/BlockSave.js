import { useBlockProps } from '@wordpress/block-editor';

const SaveComponent = (props) => {

  const {
    attributes: {
      type,
      selectedCountryFirst,
      addYear
    }
  } = props;
  const blockProps = useBlockProps.save({
    className: 'wp-react-lib component chart'
  });

  const divClass = {}
  const divStyles = {}
  return (
    <div className={"wp-react-lib-component"}
         data-component={"filter"}
         data-type={type}
         data-selected-country-first={selectedCountryFirst}
         data-add-year={addYear}
    >
    </div>


  );
}


export default SaveComponent
