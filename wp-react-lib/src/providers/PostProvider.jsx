import React from 'react'
import { connect } from 'react-redux'
import { getPosts } from '../reducers/actions'
import { PostContext } from './Context'
import { Container, Loader, Segment } from "semantic-ui-react";
import LocalizedProvider from "./LocalizedProvider"

class PostProvider extends React.Component {

    componentDidMount() {
        const {
            type = 'posts',
            taxonomy,
            categories,
            before,
            perPage,
            page,
            fields,
            slug,
            store = "posts",
            locale,
            previewNonce,
            previewId,
            search,
            postType,
            id,
            slug404,
            categoriesOr, categoryDefault
        } = this.props
        this.props.onLoadPost({
            slug, type, taxonomy, categories, before, perPage, page, fields, store, locale, previewNonce,
            previewId, search, postType, id, slug404, categoriesOr, categoryDefault
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            type = 'posts',
            taxonomy,
            categories,
            before,
            perPage,
            page,
            fields,
            slug,
            store = "posts",
            locale,
            previewNonce,
            previewId,
            search,
            postType,
            id,
            isScheduledFilter,
            scheduledFilterStore,
            slug404,
            categoriesOr,
            categoryDefault
        } = this.props
        if (categories != prevProps.categories || locale != prevProps.locale || slug != prevProps.slug ||
            taxonomy != prevProps.taxonomy || page != prevProps.page || perPage != prevProps.perPage || search != prevProps.search ||
            categoriesOr != prevProps.categoriesOr || categoryDefault != prevProps.categoryDefault

        ) {
            this.props.onLoadPost({
                slug,
                type,
                taxonomy,
                categories,
                before,
                perPage,
                page,
                fields,
                store,
                locale,
                previewNonce,
                previewId,
                search, postType, id, slug404, categoriesOr, categoryDefault
            })
        }
    }

    render() {
        const {
            posts,
            meta,
            loading,
            error,
            locale,
            isScheduledFilter,
            scheduledFilterStore,
            messages,
            loadingMessage = "Loading",
            hideNotFound
        } = this.props;
        if (posts && (posts.length > 0 || posts.id)) {
            let postsArray = posts;
            if (!Array.isArray(postsArray)) {
                postsArray = [];
                postsArray.push(posts);
            }
            if (isScheduledFilter) {
                let now = new Date().getTime();
                let isPast = scheduledFilterStore === 'past';
                postsArray = postsArray.filter(post => {
                    const acf = post['acf'];
                    if (acf) {
                        if (acf.event_end_date && acf.event_end_date !== "") {
                            let end = new Date(acf.event_end_date).getTime();
                            if ((end < now && isPast) || (end > now && !isPast)) {
                                return true;
                            }
                        } else if (acf.event_start_date && acf.event_start_date !== "") {
                            let start = new Date(acf.event_start_date).getTime();
                            if ((start < now && isPast) || (start > now && !isPast)) {
                                return true;
                            }
                        }
                    }
                    return false;
                }).sort((a, b) => !a.acf.event_start_date || !b.acf.event_start_date ? 0
                    : isPast ? new Date(b.acf.event_start_date) - new Date(a.acf.event_start_date)
                        : new Date(a.acf.event_start_date) - new Date(b.acf.event_start_date));
            } else {
                postsArray = postsArray.sort((a, b) => !a.date || !b.date ? 0
                    : new Date(b.date) - new Date(a.date));
            }
            return <PostContext.Provider
                value={{ posts: postsArray, locale, meta, messages }}>{this.props.children}</PostContext.Provider>
        } else if (error) {
            return <Segment color={"red"}>
                <h1>500</h1>
                <p>The service is not available please try again in a few minutes</p>
            </Segment>
        } else if (loading) {
            return (<Container>
                <span>{loadingMessage}...</span>
                <Loader inverted content='Loading...' />
            </Container>)
        } else {
            if (!hideNotFound) {
                return <Container>
                    <Segment color={"red"}>
                        <p>No entries found</p>
                    </Segment>
                </Container>
            } else {
                return null;
            }
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    const { store = "posts" } = ownProps
    return {
        meta: state.getIn(['wordpress', store, 'meta']),
        posts: state.getIn(['wordpress', store, 'items']),
        error: state.getIn(['wordpress', store, 'error']),
        loading: state.getIn(['wordpress', store, 'loading']),
    }
}

const mapActionCreators = {
    onLoadPost: getPosts
};

export default LocalizedProvider(connect(mapStateToProps, mapActionCreators)(PostProvider))
