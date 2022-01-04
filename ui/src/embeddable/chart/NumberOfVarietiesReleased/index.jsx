import React from "react";
import {Grid} from "semantic-ui-react";

const NumberOfVarietiesReleased = ({data}) => {
    return (
        <Grid className={`number-varieties-released`}>
            <Grid.Row className={`crops-with-icons`}>
                <Grid.Column width={16}>
                    <div className="label">Crops -- TODO: insert crop icons with a new component</div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className={`section`}>
                <Grid.Column width={16}>
                    <div>
                        TODO: insert Line chart here.
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default NumberOfVarietiesReleased
