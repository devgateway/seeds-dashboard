import { PostConsumer, PostIntro, PostProvider } from "@devgateway/wp-react-lib";

import 'pure-react-carousel/dist/react-carousel.es.css';
import React, { useEffect, useState } from "react";
import { Container, Icon } from "semantic-ui-react";
import { ButtonBack, ButtonNext, CarouselProvider, DotGroup, Slide, Slider } from "pure-react-carousel";
import { connect } from "react-redux";
import { getIndicatorsInformation, getWpCategories } from "../reducers/data";
import { WP_CATEGORIES } from "../reducers/StoreConstants";

const Carousel = ({ posts, itemsPerPage, messages, orientation, navigatorStyle }) => {
  let i = 0;
  return (<CarouselProvider
    visibleSlides={parseInt(itemsPerPage)}
    totalSlides={posts.length}
    orientation={orientation} className={navigatorStyle === 'button' ? "carousel-flex" : ''}
  >

    {navigatorStyle === 'button' && <div className="navigator">
      <ButtonBack><Icon name="angle left" /></ButtonBack>
    </div>}
    <div className={navigatorStyle === 'button' ? "carousel-container" : ''}>
      <Slider>
        {posts.map(p => {
          return <Slide index={i++} key={p.id}>
            <PostIntro post={p} fluid showLink messages={messages} />
          </Slide>;
        })}
      </Slider>
    </div>
    {navigatorStyle === 'button' && <div className="navigator">
      <ButtonNext><Icon name="angle right" /></ButtonNext>
    </div>}
    {navigatorStyle === 'dots' && <DotGroup />}
  </CarouselProvider>)


}


const _Carousel = (props) => {
  let i = 0
  const { posts } = this.props
  return <Container fluid={true} className={"carousel"}>
    <CarouselProvider totalSlides={posts.length}>
      <Slider>
        {posts.map(p => <Slide index={i++} key={p.id}>
          <PostIntro post={p} />
        </Slide>)}
      </Slider>
      <DotGroup />
    </CarouselProvider>
  </Container>

}
const PostCarousel = ({
                        "data-type": type,
                        "data-taxonomy": taxonomy,
                        "data-categories": categories,
                        "data-items": items,
                        "data-orientation": orientation = 'horizontal',
                        "data-items-per-page": itemsPerPage = 1,
                        editing, parent, unique,
                        messages,
                        "data-connect-filter": connectFilter,
                        "data-values-filter-store": valuesFilterStore,
                        "data-selected-filter-store": selectedFilterStore,
                        "data-navigator-style": navigatorStyle = 'dots',
                        filters, filtersData, categoriesWP, onLoadWPCategories
                      }) => {
  const [random, setRandomStore] = useState(Math.random() * (99999 - 1) + 1);
  useEffect(() => {
    if (connectFilter === 'true') {
      onLoadWPCategories();
    }
  }, [taxonomy, categories, onLoadWPCategories])
  let categoryWP;
  if (filters && filtersData && categoriesWP) {
    //TODO add object id (countryId) as parameter
    const filterSelected = filtersData.get(valuesFilterStore).find(fd => fd.countryId === filters.get(selectedFilterStore));
    if (filterSelected) {
      //TODO add object value (country) as parameter
      const slug = filterSelected.country.replace(/\s+/g, '-').toLowerCase();
      categoryWP = categoriesWP.find(cwp => cwp.slug === slug);
      if (!categoryWP) {
        //TODO add not-found as a parameter
        categoryWP = categoriesWP.find(cwp => cwp.slug === 'not-found');
      }
    }
  }
  return <Container className={`wp-react-lib post carousel ${editing ? 'editing' : ''}`} fluid={true}>
    <PostProvider type={type} taxonomy={taxonomy} categories={categoryWP ? categoryWP.id : categories}
                  store={"carousel_" + parent + "_" + unique} page={1}
                  perPage={items}>
      <PostConsumer>
        <Carousel itemsPerPage={itemsPerPage} messages={messages} orientation={orientation}></Carousel>
      </PostConsumer>
    </PostProvider>
  </Container>
}
const mapStateToProps = (state) => {
  return {
    filters: state.getIn(['data', 'filters']),
    categoriesWP: state.getIn(['data', WP_CATEGORIES]),
    filtersData: state.getIn(['data']),
  }
}

const mapActionCreators = {
  onLoadIndicatorsInformation: getIndicatorsInformation,
  onLoadWPCategories: getWpCategories
};

export default connect(mapStateToProps, mapActionCreators)(PostCarousel);
