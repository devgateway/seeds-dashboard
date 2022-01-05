import { useBlockProps } from '@wordpress/block-editor';

const SaveComponent = (props) => {

  const {
    attributes: {
      height,
      width,
      valuesFilterStore,
      selectedFilterStore,
      connectFilter
    }
  } = props;
  const blockProps = useBlockProps.save({
    className: 'wp-react-lib component chart'
  });

  const divClass = {}
  const divStyles = {}
  return (
    <div className={"wp-react-lib-component"}
         data-component={"imageMap"}
         data-height={height}
         data-values-filter-store={valuesFilterStore}
         data-selected-filter-store={selectedFilterStore}
         data-connect-filter={connectFilter}
         data-width={width}
    >
    </div>


  );
}


export default SaveComponent
