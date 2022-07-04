import React, { useState } from "react";
import { PostIntro } from "@devgateway/wp-react-lib";
import { Button } from "semantic-ui-react";
import { POST_CAROUSEL_CONTAINER } from "./index";


//TODO this could be configured via wp admin
const MAX_PAGE_COUNT = 1;

const VerticalPostPager = ({
                               filteredAndOrderedPosts, showLinksInModal,
                               messages, locale, isAddType, itemsPerPage
                           }) => {

    let i = 0;
    const [firstElementInArray, setFirstElementInArray] = useState(0);
    const intItemsPerPage = parseInt(itemsPerPage, 10);
    let elementsInArray = filteredAndOrderedPosts.length;
    let lastElement;
    let pagesCount;
    if (intItemsPerPage > 0) {
        pagesCount = elementsInArray / intItemsPerPage;
        if (elementsInArray + intItemsPerPage < elementsInArray) {
            lastElement = elementsInArray;
        } else {
            lastElement = firstElementInArray + intItemsPerPage;
        }
    } else {
        lastElement = elementsInArray;
    }
    return <div className="carousel  vertical three-column">
        <div>
            <div className="carousel__slider--vertical" aria-live="polite"
                 tabIndex="0"
                 role="listbox">
                <div
                    className="carousel__slider-tray-wrapper verticalSlideTrayWrap___2nO7o carousel__slider-tray-wrap--vertical"
                >
                    <ul className="sliderTray___-vHFQ sliderAnimation___300FY carousel__slider-tray verticalTray___12Key carousel__slider-tray--vertical">
                        {filteredAndOrderedPosts.slice(firstElementInArray, lastElement).map(p => {
                            return <li index={i++} key={p.id}
                                       className="slide___3-Nqo carousel__slide carousel__slide--visible"
                            >
                                <PostIntro post={p} fluid showLink showLinksInModal={showLinksInModal}
                                           messages={messages} locale={locale} isAddTypeToLink={isAddType} />
                            </li>;
                        })}
                    </ul>
                </div>
                {intItemsPerPage > 0 && pagesCount <= MAX_PAGE_COUNT &&
                    <PagedDotsVertical posts={filteredAndOrderedPosts} setFirstElementInArray={setFirstElementInArray}
                                       itemsPerPage={intItemsPerPage} currentPage={firstElementInArray} />}
                {intItemsPerPage > 0 && pagesCount > MAX_PAGE_COUNT &&
                    <PreviousNextPager posts={filteredAndOrderedPosts} setFirstElementInArray={setFirstElementInArray}
                                       itemsPerPage={intItemsPerPage} currentPage={firstElementInArray} />}

            </div>
        </div>
    </div>
}
const PreviousNextPager = ({ posts, itemsPerPage, setFirstElementInArray, currentPage }) => {
    return <div className="paged-dots-container">
        <Button disabled={currentPage - itemsPerPage < 0} onClick={() => {
            setFirstElementInArray((prevState) => {
                return prevState - itemsPerPage;
            });
            scroll();
        }
        }>Previous</Button>
        <Button disabled={currentPage + itemsPerPage >= posts.length} onClick={() => {
            setFirstElementInArray((prevState) => {
                return prevState + itemsPerPage;
            });
            scroll();
        }
        }>Next</Button>
    </div>;
}
const scroll = () => {
    const element = document.getElementById(POST_CAROUSEL_CONTAINER);
    element.scrollIntoView({ block: 'end', behavior: 'smooth' });
}
const PagedDotsVertical = ({ posts, itemsPerPage, setFirstElementInArray, currentPage }) => {
    let firstItemOfPage = 0;
    const dotArray = [];
    while (firstItemOfPage < posts.length) {
        const actualPage = firstItemOfPage;
        const isSelectedPage = currentPage === actualPage;
        dotArray.push(<button type="button" disabled={isSelectedPage}
                              className={`carousel__dot${isSelectedPage ? ' carousel__dot--selected' : ''}`}
                              onClick={(() => {
                                  setFirstElementInArray(actualPage)
                              })}>
            <span></span></button>);
        firstItemOfPage = firstItemOfPage + itemsPerPage;
    }
    return <div className="paged-dots-container">
        {dotArray}
    </div>;
}
export default VerticalPostPager;