import React from 'react'

import { CustomMessageContext } from "./CustomMessagesProvider";

const CustomMessagesConsumer = (props) => {
    return (
        <CustomMessageContext.Consumer>
            {

                ({ messages }) => {
                    return <React.Fragment>
                        {React.Children.map(props.children, (child => React.cloneElement(child, {
                            messages: messages ? messages : {}
                        })))}
                    </React.Fragment>
                }
            }
        </CustomMessageContext.Consumer>
    )
}


export default CustomMessagesConsumer