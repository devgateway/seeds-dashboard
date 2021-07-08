import { Container, Dropdown, Grid, Icon, Menu, Popup } from "semantic-ui-react";
import React, { useEffect, useState } from "react";
import MenuProvider from "../wp/providers/MenuProvider";
import MenuConsumer from "../wp/consumers/MenuConsumer";
import { PageConsumer } from "../wp";
import { injectIntl } from "react-intl";
import { replaceLink } from '../wp/htmlUtils'
import TheTitle from "../wp/template-parts/TheTitle";
import { withRouter } from "react-router";

const BreadCrumbs = ({ pages }) => {
    return (
        <React.Fragment>
            {
                pages && pages.map(p =>
                    <p>
                        {
                            p.slug !== 'home' ?
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

const CountryPopupItem = ({ selected, country, setCountry }) => {
    return (
        <>
            <a className="country-item" href="#" key={country.countryId} onClick={(e) => {
                e.preventDefault()
                setCountry(country)
            }} style={{
                color: selected ? '#f39c00':'#717171'
            }}>
                {country.name}
            </a>
            <br/>
        </>
    )
}

const CountryPopup = ({ country, countries, setCountry }) => {
    return (
        countries && countries.length &&
        <Grid centered columns={countries.length >= 2 ? 2:1} className="country-menu">
            <Grid.Column>
                {
                    countries.length >= 2 ?
                    countries.slice(0, Math.ceil(countries.length/2)).map(i =>
                        <CountryPopupItem
                            {...(country && country.countryId === i.countryId ? { selected: true } : {})}
                            country={i}
                            setCountry={setCountry}
                        />
                    ):
                    countries.map(i =>
                        <CountryPopupItem
                            {...(country && country.countryId === i.countryId ? { selected: true } : {})}
                            country={i}
                            setCountry={setCountry}
                        />
                    )
                }
            </Grid.Column>
            {
                countries.length >= 2 &&
                <Grid.Column>
                    {
                        countries.slice(Math.ceil(countries.length/2)).map(i =>
                            <CountryPopupItem
                                {...(country && country.countryId === i.countryId ? { selected: true } : {})}
                                country={i}
                                setCountry={setCountry}
                            />
                        )
                    }
                </Grid.Column>
            }
        </Grid>
    )
}

const MyMenuItems = ({ withIcons, active, menu, onSetSelected, selected, locale, setCountry, countries, setChildMenu, setFirstLink, mainMenu }) => {
    const [country, setCountryValue] = useState()
    const [countryPopup, setCountryPopup] = useState(false)
    const [countryPopupOpen, setCountryPopupOpen] = useState(false)
    const onMouseOver = (e, i) => {
        onSetSelected(i);
        if (i.post_title && i.post_title === 'Cross Country View') {
            setChildMenu('Cross Country View')
        } else if (i.post_title && i.post_title === 'Country View') {
            setChildMenu('Country View')
            setCountryPopup(true)
        }
    }
    useEffect(() => {
        if (setCountry) {
            setCountry(country)
            setCountryPopup(false)
        }
    }, [country])
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
                    const menuItem = (
                        <Menu.Item
                            key={i.ID}
                            className={`divided ${selected && selected.ID === i.ID ? 'selected' : ''}  ${active === i.slug || (active === undefined && (i.object_id === "138" || i.object_id === "19")) ? "active" : ""}`}
                            onMouseOver={ e => { onMouseOver(e, i) }}
                        >
                            { withIcons && <div className={"mark"}></div> }
                            {
                                i.child_items ?
                                <span>
                                    {i.title}
                                    {
                                        i.post_title === "Country View" &&
                                        <Icon
                                            name={`chevron ${ countryPopupOpen ? 'up' : 'down'}`}
                                            size='small'
                                            style={{ paddingLeft: '1em'}}
                                        />
                                    }
                                </span>:
                                <a href={replaceLink(i.url, locale)}>{i.title}</a>
                            }
                        </Menu.Item>
                    )
                    if (i.post_title === "Country View") {
                        return (
                            <Popup
                            className="country-popup-wrapper"
                                basic
                                flowing
                                hoverable
                                {...(!countryPopup ? { open: false } : {})}
                                pinned
                                position='bottom left'
                                style={{
                                    backgroundColor: '#ececec',
                                    borderRadius: '0',
                                    color: '#ececec'
                                }}
                                trigger={menuItem}
                                onClose={() => setCountryPopupOpen(false)}
                                onOpen={() => setCountryPopupOpen(true)}
                            >
                                <CountryPopup className="country-dropdown"
                                    country={country}
                                    countries={countries}
                                    setCountry={setCountryValue}
                                />
                            </Popup>
                        )
                    }
                    return menuItem
                })
            }
            {
                mainMenu &&
                <Menu.Item key={'selected-country'} className={`selected`}>
                    <span style={{ color: '#ffd686', fontStyle: 'italic', textTransform: 'capitalize' }}>
                        { country ? country.name + ' Selected' : '' }
                    </span>
                </Menu.Item>
            }
        </React.Fragment>
    )
}

const CountryViewSubMenu = ({ countries, country, intl, active, setChildMenu, onSetSelected, setFirstLink }) => {

    return countries && countries.length && (
        <>
            {
                countries.map((c, i) => {
                    return (
                        <Container key={'container-' + i + '-' + c.countryId} fluid={true} className={"child"} style={{display: c.iso === country.iso ? 'block':'none'}}>
                            <MenuProvider key={'menu-provider-' + i + '-' + c.countryId} slug={c.iso}>
                                <Menu key={'menu-' + i + '-' + c.countryId} fluid text>
                                    <MenuConsumer key={'menu-consumer-' + i + '-' + c.countryId}>
                                        <MyMenuItems
                                            key={'my-menu-items-' + i + '-' + c.countryId}
                                            active={active}
                                            locale={intl.locale}
                                            setChildMenu={setChildMenu}
                                            onSetSelected={onSetSelected}
                                            {...(c.iso === country.iso ? { setFirstLink: setFirstLink } : {})}
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

const Header = ({ intl, match, countries }) => {
    const [country, setCountry] = useState()
    const [childMenu, setChildMenu] = useState("Cross Country View")
    const [firstLink, setFirstLink] = useState()
    const [selected, setSelected] = useState()
    const { slug } = match.params
    useEffect(() => {
        if (firstLink) {
            const host = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
            const link = host + '/#/' + firstLink.replace('#', '')
            window.location.href = link;
        }
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
                                        mainMenu={true}
                                    >
                                    </MyMenuItems>
                                </MenuConsumer>
                            </Menu.Menu>
                            <Menu.Item fitted className="lang">
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
