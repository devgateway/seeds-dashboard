import { PostConsumer, PostIntro, PostProvider } from "@devgateway/wp-react-lib";

import 'pure-react-carousel/dist/react-carousel.es.css';
import React, { useState } from "react";
import { Container } from "semantic-ui-react";
import { CarouselProvider, DotGroup, Slide, Slider } from "pure-react-carousel";
import { ADDITIONAL_COUNTRIES } from "../filter/CountryFilter";

const Carousel = ({ posts, itemsPerPage, messages }) => {
  let i = 0
  return (<CarouselProvider
    visibleSlides={itemsPerPage}
    totalSlides={posts.length}>
    <Slider>
      {posts.map(p => {
        debugger;
        return <Slide index={i++} key={p.id}>
          <PostIntro post={p} fluid showLink messages={messages} />
        </Slide>;
      })}
    </Slider>
    <DotGroup />
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
const PostCarousel = (props) => {
  const [random, setRandomStore] = useState(Math.random() * (99999 - 1) + 1);
  const {
    "data-type": type,
    "data-taxonomy": taxonomy,
    "data-categories": categories,
    "data-items": items,
    "data-items-per-page": itemsPerPage = 1,
    editing, parent, unique,
    messages
  } = props
  return <Container className={`wp-react-lib post carousel ${editing ? 'editing' : ''}`} fluid={true}>
    <PostProvider type={type} taxonomy={taxonomy} categories={categories}
                  store={"carousel_" + parent + "_" + unique} page={1}
                  perPage={items}>
      <PostConsumer>
        <Carousel itemsPerPage={itemsPerPage} messages={messages}></Carousel>
      </PostConsumer>
    </PostProvider>
  </Container>
}
export default PostCarousel
