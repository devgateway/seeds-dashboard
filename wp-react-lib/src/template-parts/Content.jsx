import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'

import EmbeddedGateway from '../embedded/EmbeddedGateway'

import { Container } from "semantic-ui-react";

import { replaceHTMLinks, replaceLink } from "../util";

const Enhance = (props) => {
  const Component = props.as ? props.as : Container;
  const filteredProps = ['post', 'pageNumber', 'visibility', 'intl', "as"]
  const newProps = {}
  Object.keys(props).filter(p => p).forEach(e => {
    if (filteredProps.indexOf(e) == -1) {
      newProps[e] = props[e]
    }
  })
  return <Component {...newProps}>{props.children}</Component>
}


class Content extends React.Component {

  constructor(props) {
    super(props);
    this.state = {modalOpen: false};
    this.generateModal = this.generateModal.bind(this);
    this.switchModal = this.switchModal.bind(this);
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState, snapshot) {

  }

  generateModal(url) {
    const {modalOpen} = this.state;
    return (<Modal
        onClose={() => this.switchModal()}
        onOpen={() => this.switchModal()}
        closeIcon={true}
        open={modalOpen}
        size="large"
    >
      <Modal.Content>
        <Modal.Description>
          <iframe className="modal_iframe" src={url} width="100%"/>
        </Modal.Description>
      </Modal.Content>
    </Modal>)
  }

  switchModal() {
    const {modalOpen} = this.state;
    this.setState({modalOpen: !modalOpen})
  }

  render() {
    const {
      post,
      pageNumber,
      showTitle,
      showContent,
      showIntro,
      showLink,
      showDate,
      showLoading,
      as,
      locale,
      messages,
      preview, isAddTypeToLink,
      showLinksInModal
    } = this.props

    if (post) {
      const contentParts = post.content ? post.content.rendered.split("<!--more-->") : []
      const intro = contentParts.length > 0 ? contentParts[0] : null
      const content = contentParts.length > 1 ? contentParts[1] : contentParts[0]
      const pages = content ? content.split("<!--nextpage-->") : '';

      let body = content;
      if (pageNumber && pages.length > 0) {
        body = pages[pageNumber]
      }
      return <EmbeddedGateway locale={locale} messages={messages} parent={preview ? post.parent : post.id}
                              acf={post.acf}>
        <Enhance className="entry-content" {...this.props}>
          {showDate &&
            <Container fluid className="date">{post.date.toLocaleString()}</Container>}
          {showTitle &&
            <span className="title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />}
          {showIntro &&
            <Container fluid className="excerpt"
                       dangerouslySetInnerHTML={{ __html: replaceHTMLinks(intro, locale) }} />}
          {showContent &&
            <Container fluid className="content"
                       dangerouslySetInnerHTML={{ __html: replaceHTMLinks(body, locale) }} />}
          {showLink === true && showLinksInModal !== "true" &&
              <a href={isAddTypeToLink ? this.replaceSlugWithId(replaceLink(post.link, locale, isAddTypeToLink), post.slug, post.id) : replaceLink(post.link, locale, isAddTypeToLink)}
                 className="link">Read More</a>}
          {showLink === true && showLinksInModal === "true" &&
              <a className="link" style={{cursor: 'pointer'}} onClick={() => this.switchModal()}>Read More</a>}
          {showLink === true && showLinksInModal === "true" &&
              this.generateModal(replaceLink(this.props.post.link, locale, false) + 'modal')}
        </Enhance>
      </EmbeddedGateway>
    } else {
      return showLoading ? 'Loading' : false;
    }
  }

  replaceSlugWithId(replaceLink1, slug, id) {
    let url = replaceLink1;
    if (slug && id) {
      url = replaceLink1.replace(slug, id);
    }
    return url;
  }

}


export default Content
