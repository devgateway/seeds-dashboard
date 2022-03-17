import React from 'react'
import {connect} from 'react-redux'
import {getPosts} from '../reducers/actions'
import {PostContext} from './Context'
import {Container, Loader, Segment} from "semantic-ui-react";
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
            slug404
        } = this.props
        this.props.onLoadPost({
            slug, type, taxonomy, categories, before, perPage, page, fields, store, locale, previewNonce,
            previewId, search, postType, id,slug404
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
            slug404
        } = this.props

        if (categories != prevProps.categories || locale != prevProps.locale || slug != prevProps.slug ||
            taxonomy != prevProps.taxonomy || page != prevProps.page || perPage != prevProps.perPage || search != prevProps.search
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
                search, postType, id, slug404
            })
        }
    }

    render() {
        const {posts, meta, loading, error, locale, isScheduledFilter, scheduledFilterStore} = this.props;
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
                    if (post['meta_fields']['event_end']) {
                        let end = new Date(post['meta_fields']['event_end']).getTime();
                        if ((end < now && isPast) || (end > now && !isPast)) {
                            return true;
                        }
                    } else if (post['meta_fields']['event_begin']) {
                        let start = new Date(post['meta_fields']['event_begin']).getTime();
                        if ((start < now && isPast) || (start > now && !isPast)) {
                            return true;
                        }
                    }
                    return false;
                });
            }

            return <PostContext.Provider value={{ posts: postsArray, locale, meta }}>{this.props.children}</PostContext.Provider>
        } else if (error) {
            return <Segment color={"red"}>
                <h1>500</h1>
                <p>The service is not available please try again in a few minutes</p>
            </Segment>
        } else if (loading) {
            return (<Container>
                <Loader>Loading</Loader>
            </Container>)
        } else {
            return <Container>
                <Segment color={"red"}>
                    <p>No entries found</p>
                </Segment>
            </Container>
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    const {store = "posts"} = ownProps
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
