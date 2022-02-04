import React, { useState } from 'react'
import { Button, Container, Grid, Label, Menu } from 'semantic-ui-react'
import {
  MediaConsumer,
  MediaProvider,
  PostConsumer,
  PostIcon,
  PostIntro,
  PostLabel,
  PostProvider
} from "@devgateway/wp-react-lib";

const ItemMenu = ({ posts, activeItem, setActive, showLabels }) => {
  return posts ? posts.map(post => <Menu.Item key={post.id}
                                              onClick={e => setActive(post.slug)}
                                              className={(post.slug === activeItem ? 'active' : '')}>

    {showLabels ? <PostLabel post={post}></PostLabel> :
      <Label className={` _${post.slug.replace(/\s+/g, '-').toLowerCase()}`}>
        <div dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      </Label>}


  </Menu.Item>) : null

}

const GriNavigator = ({ posts, activeItem, setActive, showIcons, showLabels }) => {

  const count = posts.length
  return posts ? posts.map(post => {
    const iconUrl = post['_embedded'] && post['_embedded']["wp:featuredmedia"] ? post['_embedded']["wp:featuredmedia"][0].source_url : null
    return <Grid.Column key={post.id}
                        className={(post.slug == activeItem ? 'active' : null) + (showIcons ? ' has-icon' : '')}>

      <Button onClick={e => setActive(post.slug)} className={`${count == 1 ? 'one' : ''}`}>
        {showIcons &&
          <MediaProvider id={post.meta_fields && post.meta_fields.icon ? post.meta_fields.icon[0] : null}>
            <MediaConsumer>
              <PostIcon className={"icon"}></PostIcon>
            </MediaConsumer>
          </MediaProvider>}

        {showLabels ? <PostLabel post={post}></PostLabel> :
          <Label><span dangerouslySetInnerHTML={{ __html: post.title.rendered }} /></Label>}

      </Button>
    </Grid.Column>
  }) : null
}

const TabContent = (props) => {
  const { posts, activeItem, messages, locale } = props;
  return posts ? posts.filter(p => p.slug === activeItem).map(p => <PostIntro as={Container} fluid key={p.id}
                                                                              post={p} messages={messages}
                                                                              locale={locale} />) : null


}


const SingleTabbedView = ({ posts, showLabels, messages, locale }) => {
  let orderedPosts;
  if (posts) {
    orderedPosts = posts.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0;
      }
    );
  }
  const [activeItem, setActive] = useState(orderedPosts ? orderedPosts[0].slug : null)

  return (
    <React.Fragment>
      <Menu className="tabbed posts" text>
        <ItemMenu showLabels={showLabels} posts={orderedPosts} setActive={setActive}
                  activeItem={activeItem} />
      </Menu>
      <TabContent posts={orderedPosts} activeItem={activeItem} messages={messages} locale={locale}></TabContent>
    </React.Fragment>
  )
}


const GridTabbedView = (props) => {
  const { posts, showLabels, showIcons, messages } = props;
  const [activeItem, setActive] = useState(posts ? posts[0].slug : null)

  return (
    <React.Fragment>
      <Grid stackable className="tabbed posts" columns={posts.length}>
        <GriNavigator showIcons={showIcons} showLabels={showLabels} posts={posts} activeItem={activeItem}
                      setActive={setActive}></GriNavigator>
        <Grid.Row>
          <Grid.Column width={16} className={"content"}>
            <TabContent posts={posts} activeItem={activeItem} messages={messages}></TabContent>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  )
}


const Wrapper = (props) => {


  const {
    "data-type": type,
    "data-taxonomy": taxonomy,
    "data-categories": categories,
    "data-items": items,
    "data-theme": theme = 'light',
    "data-show-icons": showIcons,
    "data-show-labels": showLabels,
    parent, editing, unique, messages, locale
  } = props;
  return <Container className={`wp-react-lib tabbed posts ${editing ? 'editing' : ''}`} fluid={true}>

    <PostProvider type={type} taxonomy={taxonomy} categories={categories}
                  store={"tabbedposts_" + parent + '_' + unique} page={1}
                  perPage={items}>
      <PostConsumer>

        {theme == 'light' ?
          <SingleTabbedView showLabels={showLabels == "true"} messages={messages} locale={locale}></SingleTabbedView> :
          <GridTabbedView showLabels={showLabels === 'true'} showIcons={showIcons == 'true'} messages={messages}>

          </GridTabbedView>}

      </PostConsumer>

    </PostProvider>
  </Container>
}

export default Wrapper
