import React, {Component} from "react";
import {Container, Dimmer, Image} from "semantic-ui-react";

class Loading extends Component {
    render() {
        return (
            <Container>
                <Dimmer active inverted>
                    <Image src='/spinner-icon.gif' />
                    <p style={{ color: '#000000', paddingTop: '1em'}}>Loading</p>
                </Dimmer>
            </Container>
        )
    }
}

export default Loading
