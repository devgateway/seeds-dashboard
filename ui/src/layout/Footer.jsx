import React, {Component} from "react";
import {Container, Grid, Header} from "semantic-ui-react";
import './footer.scss'

class Footer extends Component {
    componentDidMount() {

    }

    render() {
        const {children, fixed, location} = this.props
        return (<Container fluid className={"footer"}>
            <Container fluid>
                <Grid columns={3}>
                    <Grid.Column>
                        <Header as={"h4"}>Development Gateway</Header>

                        <p>
                            Development Gateway, Inc.<br/>
                            1100 13th Street, NW, Suite 800<br/>
                            Washington, DC 20005, USA<br/>
                            Tel: +1.202.572.9200
                        </p>
                    </Grid.Column>
                    <Grid.Column>
                        <a className="contact" href="mailto:info@tasai.org">info@tasai.org</a>
                    </Grid.Column>
                    <Grid.Column>
                      <a href="https://www.gatesfoundation.org/" target="_blank">
                        <img className="secondary-logo" src={"/gates-logo.svg"} alt="Bill and Melinda Gates Foundation logo"></img>
                      </a>
                    </Grid.Column>
                </Grid>
            </Container>
        </Container>)
    }
}


export default Footer
