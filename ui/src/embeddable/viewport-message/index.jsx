import React, { useEffect } from "react";
import './viewport-message.scss';

import { Container } from "semantic-ui-react";

const ViewportMessage = ({
                  'data-viewport-message': viewportMessage,
                  'data-viewport-height': viewportHeight,
                  'data-viewport-width': viewportWidth
                }) => {
    if (window.innerWidth < viewportWidth || window.innerHeight < viewportHeight) {
        return (<Container>
                <div className="mobile-message">{viewportMessage}</div>
            </Container>)
    } else {
        return (<Container></Container>)
    }
}
export default ViewportMessage;
