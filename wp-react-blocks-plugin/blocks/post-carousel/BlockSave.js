const SaveComponent = (props) => {
  const {
    setAttributes,
    attributes: {
      count,
      height,
      type,
      taxonomy,
      categories,
      itemsPerPage,
      valuesFilterStore,
      selectedFilterStore,
      connectFilter,
      fieldOrientation,
      navigatorStyle
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
           data-navigator-style={navigatorStyle}
           data-height={height}
           data-categories={categories.toString()}
           className={"wp-react-lib-component"}
           data-component={"postsCarousel"}>
      </div>
    </div>


  );
}


export default SaveComponent
