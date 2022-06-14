import React, { useEffect } from "react";
import './viewport-message.scss';

import { Container } from "semantic-ui-react";

const ViewportMessage = ({
                  'data-viewport-message': viewportMessage,
                  'data-viewport-height': viewportHeight,
                  'data-viewport-width': viewportWidth
                }) => {
    if (window.innerWidth < parseInt(viewportWidth) || window.innerHeight < parseInt(viewportHeight)) {
        return (<Container>
                <div className="mobile-message">{viewportMessage}</div>
            </Container>)
    } else {
        return (<Container></Container>)
    }
}
export default ViewportMessage;
