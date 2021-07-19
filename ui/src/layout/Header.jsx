import {Container, Grid, Icon, Menu, Popup} from "semantic-ui-react";
import React, { useEffect, useState } from "react";
import {MenuProvider, MenuConsumer, PostTitle, utils} from "@devgateway/wp-react-lib";
import { injectIntl } from "react-intl";
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
                                <a href={"/#"}> Home</a> / <PostTitle as={"span"} post={p}></PostTitle>
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
        <React.Fragment key={`react-fragment-country-popup-item-` + country.countryId}>
            <a className="country-item" href="#" key={country.countryId} onClick={(e) => {
                e.preventDefault()
                setCountry(country)
            }} style={{
                color: selected ? '#f39c00':'#717171'
            }}>
                {country.name}
            </a>
            <br/>
        </React.Fragment>
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
                            key={i.countryId}
                            country={i}
                            setCountry={setCountry}
                        />
                    ):
                    countries.map(i =>
                        <CountryPopupItem
                            {...(country && country.countryId === i.countryId ? { selected: true } : {})}
                            key={i.countryId}
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
                                key={i.countryId}
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

const MyMenuItems = ({ withIcons, active, menu, onSetSelected, selected, intl, country, setCountry, countries, setChildMenu, childMenu, setFirstLink, mainMenu }) => {
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
                        setFirstLink(utils.replaceLink(i.url, intl.locale))
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
                                <a href={utils.replaceLink(i.url, intl.locale)}>{i.title}</a>
                            }
                        </Menu.Item>
                    )
                    if (i.post_title === "Country View") {
                        return (
                            <Popup
                                key={`popup-` + i.ID}
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
                                    setCountry={setCountry}
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
                        { (country && childMenu && childMenu === "Country View") ? country.name + ' Selected':'' }
                    </span>
                </Menu.Item>
            }
        </React.Fragment>
    )
}

const Header = ({intl, match, data}) => {
    const [country, setCountry] = useState()
    const [childMenu, setChildMenu] = useState("Cross Country View")
    const [firstLink, setFirstLink] = useState()
    const [selected, setSelected] = useState()
    const { slug } = match.params
    useEffect(() => {
        if (firstLink) {
            const host = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
            const link = host + '/#/' + firstLink.replace('#', '')
            window.location.href = link
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
                                <MenuConsumer key={`menu-consumer-main`}>
                                    <MyMenuItems
                                        key="main-menu-items"
                                        active={slug}
                                        intl={intl}
                                        selected={selected}
                                        onSetSelected={setSelected}
                                        country={country}
                                        setCountry={setCountry}
                                        countries={data}
                                        childMenu={childMenu}
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
                    childMenu && childMenu === "Country View" && country && data && data.length && data.map((c, i) => {
                        return (
                            <Container key={'container-' + i + '-' + c.countryId} fluid={true} className={"child"} style={{display: c.iso === country.iso ? 'block':'none'}}>
                                <MenuProvider key={'menu-provider-' + i + '-' + c.countryId} slug={c.iso}>
                                    <Menu key={'menu-' + i + '-' + c.countryId} fluid text>
                                        <MenuConsumer key={'menu-consumer-' + i + '-' + c.countryId}>
                                            <MyMenuItems
                                                key={'my-menu-items-' + i + '-' + c.countryId}
                                                active={slug}
                                                countries={data}
                                                country={country}
                                                setCountry={setCountry}
                                                intl={intl}
                                                setChildMenu={setChildMenu}
                                                onSetSelected={e => null}
                                                {...(c.iso === country.iso ? { setFirstLink: setFirstLink } : {})}
                                            />
                                        </MenuConsumer>
                                    </Menu>
                                </MenuProvider>
                            </Container>
                        )
                    })
                }
                {
                    childMenu && (childMenu === "Cross Country View" || (childMenu === "Country View" && !country)) && selected && selected.child_items &&
                    <Container fluid={true} className={"child"}>
                        <Menu fluid text>
                            <MyMenuItems
                                key="child-menu-items"
                                active={slug}
                                intl={intl}
                                withIcons
                                country={country}
                                setCountry={setCountry}
                                onSetSelected={e => null}
                                menu={{ items: selected.child_items }}
                                setChildMenu={setChildMenu}
                            >
                            </MyMenuItems>
                        </Menu>
                    </Container>
                }
            </Container>
        </React.Fragment>
    )
}

export default injectIntl(withRouter(Header))