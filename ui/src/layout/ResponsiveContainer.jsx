import React, { Component, useState } from 'react'

import { Container, Icon, Menu, Sidebar, } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import MainMenu from "@devgateway/wp-react-lib"
import { Media } from "../AppMedia"
import Footer from "./Footer";
import Header from "./Header";

// Heads up!
// We using React Static to prerender our docs with server side rendering, this is a quite simple solution.
// For more advanced usage please check Responsive docs under the "Usage" section.


/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
const DesktopContainer = ({ children, isHome }) => {
  return <Container fluid>
    <Header />
    <Container className={`desktop ${isHome ? ' home' : ''}`} fluid>
      {children}
    </Container>
  </Container>
}


DesktopContainer.propTypes = {
  children: PropTypes.node,
}
const MobileContainer = ({ children, big }) => {
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const handleSidebarHide = () => setSidebarOpened(false);
  const handleToggle = () => setSidebarOpened(true)
  return (
    <Container>
      <Sidebar
        as={Menu}
        animation='push'
        onHide={handleSidebarHide}
        vertical
        visible={sidebarOpened}>
        <Container>
          <MainMenu slug="main" />
        </Container>

      </Sidebar>

      <Sidebar.Pusher dimmed={sidebarOpened}>
        <Container fluid>
          <Menu>
            <Menu.Item onClick={handleToggle}> <Icon name='sidebar' color="orange" /> </Menu.Item>
          </Menu>
          {children}
        </Container>
      </Sidebar.Pusher>
    </Container>
  )
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}
const ResponsiveContainer = ({ children, isHome }) => {
  return <div style={{ height: '100%' }}>
    <style>
      {Media.mediaStyles}
    </style>

    <DesktopContainer isHome={isHome}>
      {children}
    </DesktopContainer>
    <Footer></Footer>

  </div>
}


export default ResponsiveContainer
