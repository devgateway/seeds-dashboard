import { Container, Menu } from "semantic-ui-react";
import React, { useEffect, useState } from "react";
import { MenuConsumer, MenuProvider, utils } from "@devgateway/wp-react-lib";
import { injectIntl } from "react-intl";
import { useHistory, withRouter } from "react-router";
import {connect} from "react-redux";
import {SELECTED_COUNTRY} from "../seeds-commons/commonConstants";
import {CURRENT_TAB} from "../embeddable/reducers/StoreConstants";

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
        <a href={"/#"}> Home </a>
        {path.map(i => !i.child_items ? <a className={i.slug === match.params.slug ? 'active' : ''}
                                           href={utils.replaceLink(i.url, intl.locale)}> {i.post_title}</a> :
            <span>{i.post_title} </span>)}
    </React.Fragment>

}))

const PrincipalMenuItem = ({ i, onSetSelected, locale, firstChildLink, isSubmenu }) => {
    if (i.child_items) {
        if (firstChildLink) {
            return <a onMouseOver={() => onSetSelected(i)}
                      href={utils.replaceLink(i.child_items[0].url, locale)}>{i.title}</a>;
        } else {
            return <span onMouseOver={() => onSetSelected(i)}>{i.title}</span>;
        }
    } else {
        return <a onMouseLeave={isSubmenu && onSetSelected(null)    } onMouseOver={() => onSetSelected(i)}
                  href={utils.replaceLink(i.url, locale)}>{i.title}</a>;
    }
}
const MyMenuItems = injectIntl(withRouter(({
                                               withIcons,
                                               active,
                                               menu,
                                               onSetSelected,
                                               selected,
                                               match,
                                               addClass,
                                               addSeparator,
                                               intl: { locale },
                                               firstChildLink,
                                               isSubmenu,
                                           }) => {
    useEffect(() => {
        if (!selected) {
            const pathSelected = getPath(menu, match)
            const items = pathSelected.filter(i => i.menu_item_parent === "0")
            if (items) {
                onSetSelected(items[0])
            }
        }

    }, [menu])


    return menu && <React.Fragment>

        {menu.items.map((i, index) => (
            <><Menu.Item
                key={i.ID}
                className={`${isSubmenu ? ' submenu ' : ''}divided ${i.child_items ? 'has-child-items' : ''}
                 ${selected && selected.ID === i.ID ? 'selected' : ''}  ${active === i.slug ? "active" : ""}
                 ${addClass && i.slug ? `_${i.slug.replace(/\s+/g, '-').toLowerCase()}` : ''}`}

            >

                {withIcons && <div className={"mark"} />} <PrincipalMenuItem i={i} onSetSelected={onSetSelected}
                                                                             locale={locale}
                                                                             firstChildLink={firstChildLink}
                                                                             isSubmenu={isSubmenu} />
            </Menu.Item>
                {index !== menu.items.length - 1 && addSeparator && <Menu.Item fitted />}</>))}

    </React.Fragment>
}))

const Header = ({ intl: { locale }, match, firstChildLink, filters }) => {
    const [selected, setSelected] = useState()
    const routerHistory = useHistory();
    const { slug, parent } = match.params;

    const isCustom = (parent && parent === MENU_DASHBOARD) || slug === MENU_DASHBOARD;


    let bannerClass;
    if (isCustom) {
        bannerClass = 'dashboard';
    } else {
        if (parent) {
            bannerClass = parent;
        } else {
            bannerClass = slug;
        }
    }
    
    const gotoLanguage = (lang) => {
        let selectedCountry = '';
        let selectedTab = '';
        if (filters) {
            if (filters.get(SELECTED_COUNTRY)) {
                selectedCountry = filters.get(SELECTED_COUNTRY);
            }
            if (filters.get(CURRENT_TAB)) {
                selectedTab = filters.get(CURRENT_TAB);
            }
        }
        const slugUrl = slug ? `/${slug}/#country=${selectedCountry}/tab=${selectedTab}` : ``;
        routerHistory.replace(`/${lang}${slugUrl}`);
    }

    const logoUrl = process.env.REACT_APP_USE_HASH_LINKS ? `/#/${locale}` : `/${locale}`


    return <MenuProvider slug={isCustom ? MENU_DASHBOARD : MENU_MAIN} locale={locale}>
        <Container fluid={true} className={`header ${!bannerClass ? ' home' : ''}`}>
            <Container fluid={true} className="top_header" />
            <Container fluid={true} className="background">
                <Menu className={"branding"} text>
                    <div className="logo-container align-content">
                        <a href={logoUrl}><img alt="Home" className="brand logo" src='/tasai_Logo.svg' /></a>
                    </div>
                    <div className="title-container align-content">
                        {isCustom && <span className="title">TASAI DASHBOARD</span>}
                        {!isCustom && <Container fluid={true} className="regular-menu">
                            <Menu.Menu className={"pages"}>
                                <MenuConsumer>
                                    <MyMenuItems active={slug} selected={selected}
                                                 onSetSelected={setSelected} firstChildLink={firstChildLink} />
                                </MenuConsumer>
                            </Menu.Menu>
                        </Container>}
                    </div>
                    <div className="lang-container align-content">
                                <div className="lang">
                                    {locale === 'en' && <a onClick={() => gotoLanguage('fr')}>français</a>}
                                    {locale === 'fr' && <a onClick={() => gotoLanguage('en')}>english</a>}
                                </div>
                    </div>
                </Menu>
            </Container>
            <Container fluid={true} className={`dashboard-menu ${bannerClass ? bannerClass : ' home'}`}>
                <Menu.Menu
                    className={`pages${(!selected || !selected.child_items) && !isCustom ? ' not-selected' : ''}`}>
                    {isCustom &&
                        <MenuConsumer>
                            <MyMenuItems active={slug} selected={selected}
                                         onSetSelected={setSelected} addClass addSeparator isSubmenu={true} />
                        </MenuConsumer>
                    }
                    {!isCustom && selected && selected.child_items &&
                        <MyMenuItems active={slug} locale={locale} onSetSelected={e => null}
                                     addSeparator addClass menu={{ items: selected.child_items }}
                        >}</MyMenuItems>
                    }
                </Menu.Menu>
            </Container>
        </Container>
    </MenuProvider>
}

const mapStateToProps = (state) => {
    return {filters: state.getIn(['data', 'filters']),}
}
const mapActionCreators = {}
export default connect(mapStateToProps, mapActionCreators)(injectIntl(withRouter(Header)));
