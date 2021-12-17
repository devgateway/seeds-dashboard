const SaveComponent = (props) => {
  const {
    setAttributes,
    attributes: {
      count,
      type,
      taxonomy,
      categories,
      itemsPerPage,
      valuesFilterStore,
      selectedFilterStore,
      connectFilter,
      fieldOrientation
    },
  } = props;

  const divClass = {}
  const divStyles = {}


  return (<div className={divClass} style={divStyles}>
      <div data-items={count} data-type={type}
           data-items-per-page={itemsPerPage}
           data-taxonomy={taxonomy}
           data-values-filter-store={valuesFilterStore}
           data-selected-filter-store={selectedFilterStore}
           data-connect-filter={connectFilter}
           data-orientation={fieldOrientation}
           data-categories={categories.toString()}
           className={"wp-react-lib-component"}
           data-component={"postsCarousel"}>
      </div>
    </div>


  );
}


export default SaveComponent
