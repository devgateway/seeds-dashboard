const SaveComponent = (props) => {
  const {
    setAttributes,
    attributes: {
      count,
      type,
      taxonomy,
      categories,
      itemsPerPage
    },
  } = props;

  const divClass = {}
  const divStyles = {}


  return (<div className={divClass} style={divStyles}>
      <div data-items={count} data-type={type}
           data-items-per-page={itemsPerPage}
           data-taxonomy={taxonomy}
           data-categories={categories.toString()}
           className={"wp-react-lib-component"}
           data-component={"postsCarousel"}>
      </div>
    </div>


  );
}


export default SaveComponent
