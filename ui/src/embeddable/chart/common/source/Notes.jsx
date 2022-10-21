import React, { useState } from "react";
import { PostConsumer, PostIntro, PostProvider } from "@devgateway/wp-react-lib";
import './notes-styles.scss';
import { Accordion, Grid, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { COUNTRIES_FILTER, DATA, WP_CATEGORIES } from "../../../reducers/StoreConstants";
import { getSelectedCountry } from "../../index";

const COUNTRY_CATEGORIES = 'countries';
const NOTES_CATEGORIES = 'notes-category';

const Notes = ({
                   title,
                   titleClass,
                   chardIdCategory,
                   countries,
                   filters,
                   categoriesWP,
                   setHasNotes,
                   intl,
                   isCrossCountryChart
               }) => {
    const type = 'posts';
    const taxonomy = 'categories';
    let categories;
    let countryCategory;
    let notesCategories = [];
    if (chardIdCategory) {
        notesCategories.push(chardIdCategory);
    }
    if (categoriesWP) {
        if (filters && countries && !isCrossCountryChart) {
            const selectedCountry = getSelectedCountry(filters, countries);
            const category = categoriesWP.find(i => i.name === COUNTRY_CATEGORIES);
            countryCategory = categoriesWP.find(i => i.parent === category.id
                && i.name.toLowerCase() === selectedCountry.country.toLowerCase());
            if (countryCategory) {
                notesCategories.push(countryCategory.id);
            }
        }
        const notesCategory =
            categoriesWP.find(c => c.slug === NOTES_CATEGORIES)

        if (notesCategory) {
            categories = notesCategory.id;
        }
    }
    return (<>
            {chardIdCategory ? <PostProvider type={type} taxonomy={taxonomy}
                                             categories={categories.toString()}
                                             store={"notes" + chardIdCategory}
                                             page={1} loadingMessage={intl.formatMessage({
                id: 'loading-notes',
                defaultMessage: 'Loading notes'
            })}>
                <PostConsumer>
                    <Note title={title} titleClass={titleClass} notesCategories={notesCategories}
                          setHasNotes={setHasNotes} intl={intl} />
                </PostConsumer>
            </PostProvider> : null}
        </>
    )
}
const Note = ({ notesCategories, posts, setHasNotes, intl }) => {
    const [activeIndex, setActiveIndex] = useState(undefined)
    const handleClick = (e, titleProps) => {
        const { index } = titleProps
        const newIndex = activeIndex === index ? -1 : index
        setActiveIndex(newIndex);
    }
    let notePost;
    if (!posts || posts.length === 0) {
        return null;
    } else {
        notePost = posts.filter(p => notesCategories.every(c => p.categories.includes(c)));
        if (!notePost || notePost.length === 0) {
            return null;
        } else {
            setHasNotes(true)
        }
    }
    return (
        <>
            {
                (notePost && notePost.length > 0) ? <Grid.Row className={`source-section no-top-border`}>
                    <Grid.Column>
                        <div>
                            <div className="indicator-note">
                                <Accordion>
                                    <Accordion.Title
                                        active={activeIndex === 0}
                                        index={0}
                                        onClick={handleClick}
                                    >
                                        {intl.formatMessage({ id: 'notes', defaultMessage: 'Notes' })}
                                        <Icon name={`angle ${activeIndex === 0 ? 'up' : 'down'}`} />
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === 0}>
                                        <p>
                                            <PostIntro post={notePost[0]} fluid showLink
                                                       showLink={false}
                                            />
                                        </p>
                                    </Accordion.Content>
                                </Accordion>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row> : null
            }</>)
}


const mapStateToProps = (state) => {
    return {
        filters: state.getIn(['data', 'filters']),
        countries: state.getIn([DATA, COUNTRIES_FILTER]),
        categoriesWP: state.getIn([DATA, WP_CATEGORIES]),
    }
}
const mapActionCreators = {}
export default connect(mapStateToProps, mapActionCreators)(injectIntl(Notes))

