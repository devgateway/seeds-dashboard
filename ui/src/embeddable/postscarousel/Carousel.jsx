import { PostIntro } from "@devgateway/wp-react-lib";

import { ButtonBack, ButtonNext, CarouselProvider, Dot, DotGroup, Slide, Slider } from "pure-react-carousel";
import { BUTTONS, DOTS, PAGED_DOTS } from "./Constants";
import { Icon } from "semantic-ui-react";
import React from "react";
import VerticalPostPager from "./VerticalPostPager";
import { connect } from "react-redux";
import { DATA } from "../reducers/StoreConstants";
import { SELECTED_INDICATOR } from "../../seeds-commons/commonConstants";
import { injectIntl } from "react-intl";

const Carousel = ({
                      posts,
                      itemsPerPage,
                      messages,
                      orientation,
                      navigatorStyle = DOTS,
                      locale,
                      type,
                      showLinksInModal,
                      categories,
                      isSortedByCountryAndYearCategories,
                      filters, intl
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
        filteredAndOrderedPosts.sort((a, b) => (b.categoriesHydrated.year - a.categoriesHydrated.year
            || (a.categoriesHydrated.country
                && a.categoriesHydrated.country.localeCompare(b.categoriesHydrated.country)))
        )
    }

    if (filters && filters.get(SELECTED_INDICATOR)) {

        filteredAndOrderedPosts = filteredAndOrderedPosts.filter
        (p => p.categories.includes(filters.get(SELECTED_INDICATOR)))
    }

    const isAddType = type !== undefined;
    const finalItemsPerPage = itemsPerPage > 0 ? parseInt(itemsPerPage) : filteredAndOrderedPosts.length;
    if (orientation === 'vertical') {
        return (<VerticalPostPager
                filteredAndOrderedPosts={filteredAndOrderedPosts} showLinksInModal={showLinksInModal}
                messages={messages} locale={locale} isAddTypeToLink={isAddType} itemsPerPage={itemsPerPage}
                columns={3} />
        )
    } else {
        let i = 0;
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
                                       messages={messages} locale={locale} isAddTypeToLink={isAddType}
                                       readMore={intl.formatMessage({ id: "read-more" })} />
                        </Slide>;
                    })}
                </Slider>
            </div>
            {navigatorStyle === BUTTONS && <div className="navigator">
                <ButtonNext><Icon name="chevron right" /></ButtonNext>
            </div>}
            {navigatorStyle === DOTS && <DotGroup />}
            {navigatorStyle === PAGED_DOTS && <PagedDots posts={posts} itemsPerPage={finalItemsPerPage} />}

        </CarouselProvider>)
    }
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
const mapStateToProps = (state, ownProps) => {
    return { filters: state.getIn([DATA, 'filters']) }
}
export default connect(mapStateToProps, {})(injectIntl(Carousel));
