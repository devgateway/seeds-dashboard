import React from 'react'

import {PageContext} from '../providers/Context'

const PageConsumer = (props) => {

    return (
        <React.Fragment>
            <PageContext.Consumer>
                {

                    ({pages, meta, locale, messages}) => {
                        return pages && <React.Fragment>
                            {React.Children.map(props.children, (child => React.cloneElement(child, {
                                pages,
                                meta,
                                locale,
                              messages
                            })))}
                        </React.Fragment>
                    }
                }
            </PageContext.Consumer>
        </React.Fragment>)
}


export default PageConsumer
