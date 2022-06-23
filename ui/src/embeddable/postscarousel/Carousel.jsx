import { PostIntro } from "@devgateway/wp-react-lib";

import { ButtonBack, ButtonNext, CarouselProvider, Dot, DotGroup, Slide, Slider } from "pure-react-carousel";
import { BUTTONS, DOTS, PAGED_DOTS } from "./Constants";
import { Icon } from "semantic-ui-react";
import React from "react";

export const Carousel = ({
                             posts,
                             itemsPerPage,
                             messages,
                             orientation,
                             navigatorStyle = DOTS,
                             locale,
                             type,
                             showLinksInModal,
                             categories,
                             isTwoColumns,//TODO no used until SEEDSDT-839 is fixed
                             isSortedByCountryAndYearCategories
                         }) => {
    let filteredAndOrderedPosts = posts;

    if (categories && isSortedByCountryAndYearCategories) {
        const categoryYear = categories.find(cwp => cwp.slug === 'years');
        const categoryCountry = categories.find(cwp => cwp.slug === 'countries');
        if (categoryYear && categoryCountry) {
            posts.forEach(p => {
                p.categoriesHydrated = {};
                p.categories.forEach(c => {
                    const category = categories.find(cwp => cwp.id === c);
                    if (category.parent === categoryYear.id) {
                        p.categoriesHydrated.year = parseInt(category.name);
                    } else {
                        if (category.parent === categoryCountry.id) {
                            p.categoriesHydrated.country = category.name;
                        }
                    }
                });
            });
        }
        filteredAndOrderedPosts.sort((a, b) => (b.categoriesHydrated.year - a.categoriesHydrated.year || a.categoriesHydrated.country.localeCompare(b.categoriesHydrated.country)))
        /* TODO until SEEDSDT-839 is fixed
        if (isTwoColumns) {
            filteredAndOrderedPosts = posts.filter((_, i) => i % 2 === 0).concat(posts.filter((_, i) => i % 2 === 1));
        }*/
    }


    let i = 0;
    const isAddType = type !== undefined;
    const finalItemsPerPage = itemsPerPage > 0 ? parseInt(itemsPerPage) : filteredAndOrderedPosts.length;
    return (<CarouselProvider
        visibleSlides={finalItemsPerPage}
        totalSlides={filteredAndOrderedPosts.length}
        orientation={orientation} className={navigatorStyle === BUTTONS ? "carousel-flex" : ''}
        step={finalItemsPerPage}
    >
        {navigatorStyle === BUTTONS && <div className="navigator">
            <ButtonBack><Icon name="chevron left" /></ButtonBack>
        </div>}
        <div className={navigatorStyle === BUTTONS ? "carousel-container" : ''}>
            <Slider dragEnabled={false}>
                {filteredAndOrderedPosts.map(p => {
                    return <Slide index={i++} key={p.id}>
                        <PostIntro post={p} fluid showLink showLinksInModal={showLinksInModal}
                                   messages={messages} locale={locale} isAddTypeToLink={isAddType} />
                    </Slide>;
                })}
            </Slider>
        </div>
        {navigatorStyle === BUTTONS && <div className="navigator">
            <ButtonNext><Icon name="chevron right" /></ButtonNext>
        </div>}
        {navigatorStyle === DOTS && <DotGroup />}
        {navigatorStyle === PAGED_DOTS && <PagedDots posts={posts} itemsPerPage={finalItemsPerPage  } />}

    </CarouselProvider>)
}
const PagedDots = ({ posts, itemsPerPage }) => {
    let firstItemOfPage = 0;
    const dotArray = [];
    while (firstItemOfPage < posts.length) {
        dotArray.push(<Dot slide={firstItemOfPage}><span /></Dot>);
        firstItemOfPage = firstItemOfPage + parseInt(itemsPerPage, 10)
    }
    return <div className="paged-dots-container">{dotArray}</div>;
}
