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
                    <img className="footer-logo" src={"/tasai-logo.svg"} alt="TASAI logo"/>
                    <span className="footer-title">Seeds Dashboard</span>
                    </Grid.Column>
                    <Grid.Column>
                        <a className="contact" href="mailto:info@tasai.org">info@tasai.org</a>
                    </Grid.Column>
                    <Grid.Column>
                      <a href="https://www.gatesfoundation.org/" target="_blank">
                        <img className="secondary-logo" src={"/gates-logo.svg"} alt="Bill and Melinda Gates Foundation logo"/>
                      </a>
                    </Grid.Column>
                </Grid>
            </Container>
        </Container>)
    }
}


export default Footer
