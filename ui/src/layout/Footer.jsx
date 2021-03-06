import React, { Component } from "react";
import { Container } from "semantic-ui-react";

import { Page, PageConsumer, PageProvider } from "@devgateway/wp-react-lib";

const Footer = () => {
  return <Container fluid className={"wp-react-lib footer"}>
    <Container fluid className={"header"}>
    </Container>
    <PageProvider slug={"footer"} store={"footer"}>
      <PageConsumer>
        <Page></Page>
      </PageConsumer>
    </PageProvider>

  </Container>
}
export default Footer
