import React, {Component} from "react";
import {Grid, Image} from "semantic-ui-react";

class Loading extends Component {
    render() {
        return (
            <Grid textAlign='center' verticalAlign='middle' columns={16} centered style={{ margin: '0em', height: this.props.height ? this.props.height + 'px' : '100%' }}>
                <Grid.Row>
                    <Grid.Column>
                        <Image src='/spinner-icon.gif' />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default Loading
