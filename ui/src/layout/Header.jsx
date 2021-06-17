import { Container, Dropdown, Flag, Menu } from "semantic-ui-react";
import React, { useEffect, useState } from "react";
import MenuProvider from "../wp/providers/MenuProvider";
import MenuConsumer from "../wp/consumers/MenuConsumer";
import { PageConsumer } from "../wp";
import { injectIntl } from "react-intl";
import { replaceLink } from '../wp/htmlUtils'
import TheTitle from "../wp/template-parts/TheTitle";
import { withRouter } from "react-router";
import { getData } from "../data/api";
import Search from '../wp/Search'

const BreadCrumbs = ({ pages }) => {
    return (
        <React.Fragment>
            {
                pages && pages.map(p =>
                    <p>
                        {
                            p.slug != 'home' ?
                            <span>
                                <a href={"/#"}> Home</a> / <TheTitle as={"span"} post={p}></TheTitle>
                            </span>
                            : ''
                        }
                    </p>
                )
            }
        </React.Fragment>
    )
}

const CountryDropdown = ({ visible, countries, setCountry, setCountryDropDownVisible }) => {
    return (
        visible && countries.length ?
            <Dropdown open={visible}>
                <Dropdown.Menu style={{ backgroundColor: '#ececec', left: '-10em', marginTop:'2em', right: '-1.6em' }}>
                    {
                        countries.map(i => {
                            return (
                                <Dropdown.Item key={i.countryId} onClick={(e, data) => {
                                    setCountry(data.country)
                                    setCountryDropDownVisible(false)
                                }} value={i.countryId} country={i}>
                                    <span style={{color: '#303030', fontWeight: 700}}>{i.name}</span>
                                </Dropdown.Item>
                            )
                        })
                    }
                </Dropdown.Menu>
            </Dropdown>
        :<Dropdown></Dropdown>
    )
}

const MyMenuItems = ({ withIcons, active, menu, onSetSelected, selected, locale, setCountry, countries, setChildMenu, setFirstLink }) => {
    const [visible, setCountryDropDownVisible] = useState(false)
    const onMouseOver = (e, i) => {
        onSetSelected(i);
        if (i.post_title && i.post_title === 'Cross Country View') {
            setChildMenu('Cross Country View')
            setCountryDropDownVisible(false)
        } else if (i.post_title && i.post_title === 'Country View') {
            setChildMenu('Country View')
            setCountryDropDownVisible(true)
        } else {
            setCountryDropDownVisible(false)
        }
    }
    return menu && (
        <React.Fragment>
            {
                menu.items.map((i, key) => {
                    if (selected === undefined && i.post_title === "Cross Country View") {
                        onSetSelected(i)
                    }
                    if (setFirstLink && !i.child_items && key === 0) {
                        setFirstLink(replaceLink(i.url, locale))
                    }
                    return (
                        <Menu.Item
                            key={i.ID}
                            className={`divided ${selected && selected.ID === i.ID ? 'selected' : ''}  ${active === i.slug || (active === undefined && (i.object_id === "138" || i.object_id === "19")) ? "active" : ""}`}
                            onMouseOver={ e => { onMouseOver(e, i) }}
                        >
                            { withIcons && <div className={"mark"}></div> }
                            { i.child_items ? <span>{i.title}</span> : <a href={replaceLink(i.url, locale)}>{i.title}</a> }
                            { i.post_title === "Country View" &&
                                <CountryDropdown
                                    visible={visible}
                                    countries={countries}
                                    setCountry={setCountry}
                                    setCountryDropDownVisible={setCountryDropDownVisible}
                                />
                            }
                        </Menu.Item>
                    )
                })
            }
        </React.Fragment>
    )
}

const CountryViewSubMenu = ({ countries, country, intl, active, setChildMenu, onSetSelected, setFirstLink }) => {
    return countries && countries.length && (
        <>
            {
                countries.map(c => {
                    return (
                        <Container key={c.countryId} fluid={true} className={"child"} style={{display: c.iso === country.iso ? 'block':'none'}}>
                            <MenuProvider slug={c.iso}>
                                <Menu fluid text>
                                    <MenuConsumer>
                                        <MyMenuItems
                                            active={active}
                                            locale={intl.locale}
                                            setChildMenu={setChildMenu}
                                            onSetSelected={onSetSelected}
                                            setFirstLink={setFirstLink}
                                        />
                                    </MenuConsumer>
                                </Menu>
                            </MenuProvider>
                        </Container>
                    )
                })
            }
        </>
    )
}

const Header = ({ intl, match, history, countries }) => {
    const [country, setCountry] = useState()
    const [childMenu, setChildMenu] = useState("Cross Country View")
    const [firstLink, setFirstLink] = useState()
    const [selected, setSelected] = useState()
    const { slug } = match.params
    useEffect(() => {
        // history.push(firstLink);
        console.log(firstLink)
    }, [firstLink])
    return (
        <React.Fragment>
            <Container fluid={true} className="header">
                <Container fluid={true} className={"background"}>
                    <MenuProvider slug={"main"}>
                        <Menu className={"branding"} text>
                            <a href="/"><img className="logo" src='/tasai-logo.svg' /></a>
                            <span className="title">Seeds Dashboard</span>
                            <Menu.Menu className={"pages"}>
                                <MenuConsumer>
                                    <MyMenuItems
                                        active={slug}
                                        locale={intl.locale}
                                        selected={selected}
                                        onSetSelected={setSelected}
                                        setCountry={setCountry}
                                        countries={countries}
                                        setChildMenu={setChildMenu}
                                    >
                                    </MyMenuItems>
                                </MenuConsumer>
                            </Menu.Menu>
                            <Menu.Item fitted className="lang">
                                {
                                    country ?
                                    <span style={{
                                        color: '#ffd686',
                                        float: 'left',
                                        fontSize: '0.8em',
                                        fontWeight: '700',
                                        marginRight: '1em'
                                    }}>
                                        [{ country.name }]
                                    </span> : ''
                                }
                                <a href="">Français</a>
                            </Menu.Item>
                        </Menu>
                    </MenuProvider>
                </Container>
                {
                    childMenu && childMenu === "Country View" && country &&
                    <CountryViewSubMenu
                        active={slug}
                        countries={countries}
                        country={country}
                        intl={intl}
                        setChildMenu={setChildMenu}
                        onSetSelected={setSelected}
                        setFirstLink={setFirstLink}
                    />
                }
                {
                    childMenu && (childMenu === "Cross Country View" || (childMenu === "Country View" && !country)) && selected && selected.child_items &&
                    <Container fluid={true} className={"child"}>
                        <Menu fluid text>
                            <MyMenuItems
                                active={slug}
                                locale={intl.locale}
                                withIcons
                                onSetSelected={e => null}
                                menu={{ items: selected.child_items }}
                                setChildMenu={setChildMenu}
                            >
                            </MyMenuItems>
                        </Menu>
                    </Container>
                }
            </Container>
            <Container className={"url breadcrumbs"}>
                <PageConsumer>
                    <BreadCrumbs></BreadCrumbs>
                </PageConsumer>
            </Container>
        </React.Fragment>
    )
}

export default injectIntl(withRouter(Header))
