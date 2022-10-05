import React from 'react'
import {PostContext} from '../providers/Context'

const PostConsumer = (props) => {
    return (
        <PostContext.Consumer>
            {({posts, meta, locale, messages}) => {
                return posts && <React.Fragment>
                    {React.Children.map(props.children, (child => React.cloneElement(child, {
                        posts,
                        meta,
                        locale,
                        messages
                    })))}
                </React.Fragment>
            }}
        </PostContext.Consumer>
    )
}


export default PostConsumer
