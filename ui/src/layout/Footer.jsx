import React, {Component} from "react";
import {Container, Grid, Header, Image} from "semantic-ui-react";
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
                      <img className="footer-logo" src={"/tasai-logo.svg"} alt="TASAI logo"></img>
                      <Header as={"h3"}>Seeds Dashboard</Header>
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
