const SaveComponent = (props) => {
  const {
    setAttributes,
    attributes: {
      defaultPage,
      valuesFilterStore,
      selectedFilterStore,
      connectFilter,
      height,
      slugPrefix
    },
  } = props;

  const divClass = {}
  const divStyles = {}


  return (<div className={divClass} style={divStyles}>
      <div data-default-page={defaultPage}
           data-values-filter-store={valuesFilterStore}
           data-selected-filter-store={selectedFilterStore}
           data-connect-filter={connectFilter}
           data-height={height}
           data-slug-pre-fix={slugPrefix}
           className={"wp-react-lib-component"}
           data-component={"innerPage"}>
      </div>
    </div>


  );
}


export default SaveComponent
