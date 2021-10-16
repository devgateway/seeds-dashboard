import { Container, Flag, Menu } from "semantic-ui-react";
import React, { useEffect, useState } from "react";
import { MenuConsumer, MenuProvider, utils } from "@devgateway/wp-react-lib";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";

const MENU_DASHBOARD = 'dashboard';
const MENU_MAIN = 'main';
const getPath = (menu, match) => {
  let path = [];
  menu.items.forEach(item => {
    if (item.child_items) {
      item.child_items.forEach(ch => {
        if (ch.slug === match.params.slug) {
          path.push(item)
          path.push(ch)
        }
      })
    } else if (item.slug === match.params.slug && item.url !== '/') {
      path.push(item)
    }


  })
  return path
}


const BreadCrumbs = withRouter(injectIntl(({ menu, match, intl }) => {

  let path = getPath(menu, match)
  return <React.Fragment>
    <a href={"#"}> Home </a>
    {path.map(i => !i.child_items ? <a className={i.slug === match.params.slug ? 'active' : ''}
                                       href={utils.replaceLink(i.url, intl.locale)}> {i.post_title}</a> :
      <span>{i.post_title} </span>)}
  </React.Fragment>

}))


const MyMenuItems = injectIntl(withRouter(({
                                             withIcons,
                                             active,
                                             menu,
                                             onSetSelected,
                                             selected,
                                             match,
                                             addClass,
                                             addSeparator,
                                             intl: { locale }
                                           }) => {

  useEffect(() => {
    if (!selected) {
      const pathSelected = getPath(menu, match)
      const items = pathSelected.filter(i => i.menu_item_parent === 0)
      if (items) {
        onSetSelected(items[0])
      }
    }

  }, [menu])


  return menu && <React.Fragment>

    {menu.items.map((i, index) => (
      <><Menu.Item
        className={`divided ${i.child_items ? 'has-child-items' : ''} 
                 ${selected && selected.ID === i.ID ? 'selected' : ''}  ${active === i.slug ? "active" : ""} 
                 ${addClass && i.slug ? i.slug.replace(/\s+/g, '-').toLowerCase() : ''}`}

      >

        {withIcons && <div className={"mark"} />} {i.child_items ?
        <span onMouseOver={() => onSetSelected(i)}>{i.title}</span> :
        <a onMouseOver={() => onSetSelected(i)} href={utils.replaceLink(i.url, locale)}>{i.title}</a>}

      </Menu.Item>
        {index !== menu.items.length - 1 && addSeparator && <Menu.Item fitted />}</>))}

  </React.Fragment>
}))

const Header = ({ intl: { locale }, match }) => {

  const [selected, setSelected] = useState()
  const { slug, parent } = match.params;
  let isCustom = false;
  if ((parent && parent === MENU_DASHBOARD) || slug === MENU_DASHBOARD) {
    isCustom = true;
  }
  const logoUrl = process.env.REACT_APP_USE_HASH_LINKS ? `/#/${locale}` : `/${locale}`

  return <MenuProvider slug={isCustom ? MENU_DASHBOARD : MENU_MAIN}>
    <Container fluid={true} className="header">
      <Container fluid={true} className="top_header" />
      <Container fluid={true} className="background">
        <Menu className={"branding"} text>
          <div className="logo-container align-content">
            <a href={logoUrl}><img alt="Home" className="brand logo" src='/tasai_Logo.svg' /></a>
          </div>
          <div className="title-container align-content">
            <span className="title">TASAI DASHBOARD</span>
          </div>
          <div className="lang-container align-content">
            <div className="lang"><a>français</a></div>
          </div>
        </Menu>
      </Container>

      {isCustom &&
      <Container fluid={true} className="dashboard-menu">
        <Menu.Menu className={"pages"}>
          <MenuConsumer>
            <MyMenuItems active={slug} selected={selected}
                         onSetSelected={setSelected} addClass addSeparator />
          </MenuConsumer>
        </Menu.Menu>
      </Container>
      }
    </Container>

    {!isCustom && <Container className={"url breadcrumbs"}>
      <MenuConsumer>
        <BreadCrumbs />
      </MenuConsumer>
    </Container>
    }
  </MenuProvider>

}


export default injectIntl(withRouter(Header))
