import {Container, Grid, Icon, Menu, Popup} from "semantic-ui-react";
import React, { useEffect, useState } from "react";
import {MenuProvider, MenuConsumer, PostTitle, utils} from "@devgateway/wp-react-lib";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import {connect} from 'react-redux'
import {setCountry} from '../embeddable/reducers/data'

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

const MyMenuItems = ({withIcons, active, menu, selected, intl, country, setCountry, countries, setChildMenu, childMenu, mainMenu}) => {
    const [countryPopup, setCountryPopup] = useState(false)
    const [countryPopupOpen, setCountryPopupOpen] = useState(false)
    useEffect(() => {
        // auto closes popup when country is selected
        if (country) {
            setCountryPopup(false)
        }
    }, [country])
    return menu && menu.items ?
        <React.Fragment>
            {
                menu.items.map((i, key) => {
                    const menuItem = (
                        <Menu.Item
                            key={i.ID}
                            className={`divided ${((selected && selected.ID === i.ID) || (i.post_title === 'Country View' && country)) ? 'selected' : ''}  ${active === i.slug || (active === undefined && (i.object_id === "138" || i.object_id === "19")) ? "active" : ""}`}
                            onMouseOver={ e => {
                                if (i.post_title && (i.post_title === 'Cross Country View' || i.post_title === 'Country View')) {
                                    setChildMenu(i.post_title)
                                    if (i.post_title === 'Country View') {
                                        setCountryPopup(true)
                                    }
                                }
                            }}
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
                                <CountryPopup
                                    className="country-dropdown"
                                    country={country}
                                    countries={countries}
                                    setCountry={setCountry}
                                ></CountryPopup>
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
                        { country ? country.name + ' Selected':'' }
                    </span>
                </Menu.Item>
            }
        </React.Fragment> : null
}

const MenuExtractor = ({type, menu, setMenu}) => {
    useEffect(() => {
        setMenu(type, menu)
    }, [type, menu])
    return null
}

const Header = ({intl, match, data, country, setCountry}) => {
    const [mainMenuItems, setMainMenuItems] = useState([])
    const [childMenuItems, setChildMenuItems] = useState([])
    const [childMenu, setChildMenu] = useState("Cross Country View")
    const [selected, setSelected] = useState()
    const [preview, setPreview] = useState()
    const { slug, lan } = match.params
    const useHash = process.env.REACT_APP_USE_HASH_LINKS.toLowerCase() === "true";
    const setMenu = (type, menu) => {
        if (type === 'main') {
            let items = {...mainMenuItems}
            items[menu.name] = { items: menu.items }
            setMainMenuItems(items)
        } else if (type === 'child') {
            let items = {...childMenuItems}
            items[menu.name] = { child_items: menu.items }
            setChildMenuItems(items)
        }
    }
    useEffect(() => {
        let view = "Country View"
        let country = null
        if (slug === undefined) {
            view = "Cross Country View"
        }
        else {
            if (
                mainMenuItems['Main'] &&
                mainMenuItems['Main']['items'] &&
                mainMenuItems['Main']['items'][0] &&
                mainMenuItems['Main']['items'][0]['child_items']
            ) {
                const mainMenuMatches = mainMenuItems['Main']['items'][0]['child_items'].filter(i => {
                    const current = utils.replaceLink(i.url, intl.locale) // make url local
                        .replace((useHash ? '#':'') + lan, '') // remove language and/or hash
                        .replace(/(^\/)|(\/$)/g, "") // remove leading and trailing "/"
                    return current === slug
                })
                if (mainMenuMatches.length) {
                    view = "Cross Country View"
                }
            }
            // else if (data.length) {
            //     for(var i = 0; i < data.length; i++) {
            //         if (childMenuItems[data[i].iso] && childMenuItems[data[i].iso]['child_items']) {
            //             let childMenuMatches = childMenuItems[data[i].iso]['child_items'].filter(i => {
            //                 const current = utils.replaceLink(i.url, intl.locale) // make url local
            //                     .replace((useHash ? '#':'') + lan, '') // remove language and/or hash
            //                     .replace(/(^\/)|(\/$)/g, "") // remove leading and trailing "/"
            //                 return current === slug
            //             })
            //             if (childMenuMatches.length) {
            //                 view = "Country View"
            //                 country = data[i]
            //                 break;
            //             }
            //         }
            //     }
            // }
        }
        if (view === "Cross Country View") {
            setCountry(null)
            setPreview(undefined)
            setChildMenu("Cross Country View")
        } else if (view === "Country View" && country) {
            setChildMenu("Country View")
            setCountry(country)
        }
    // }, [slug, mainMenuItems, intl.locale, lan, useHash, childMenuItems, data, setCountry])
    }, [slug, mainMenuItems, intl.locale, lan, useHash, setCountry])
    useEffect(() => {
        if (country) {
            setChildMenu('Country View')
            const menuItem = childMenuItems[country.iso]
            setSelected(menuItem)
            if (menuItem && menuItem['child_items'] && menuItem['child_items'][0] && menuItem['child_items'][0]['url']) {
                const firstLink = utils.replaceLink(menuItem['child_items'][0]['url'], intl.locale)
                const host = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
                const link = host + '/#/' + firstLink.replace('#', '')
                window.location.href = link
            }
        }
    }, [country])
    useEffect(() => {
        if (selected === undefined) {
            if (
                childMenu === "Cross Country View" &&
                mainMenuItems['Main'] &&
                mainMenuItems['Main']['items'] &&
                mainMenuItems['Main']['items'][0]
            ) {
                setSelected(mainMenuItems['Main']['items'][0])
            } else if (
                childMenu === "Country View" &&
                country &&
                childMenuItems[country.iso]
            ) {
                setSelected(childMenuItems[country.iso])
            }
        } else {
            if (
                childMenu === "Cross Country View" &&
                mainMenuItems['Main'] &&
                mainMenuItems['Main']['items'] &&
                mainMenuItems['Main']['items'][0]
            ) {
                setPreview(mainMenuItems['Main']['items'][0])
            } else if (childMenu === "Country View") {
                setPreview(undefined)
            }
        }
    }, [selected, childMenu, mainMenuItems, childMenuItems, country, setSelected])
    return (
        <React.Fragment>
            <MenuProvider slug={"main"} key={`menu-provider-main`}>
                <MenuConsumer key={`menu-consumer-main`}>
                    <MenuExtractor type={'main'} setMenu={setMenu}></MenuExtractor>
                </MenuConsumer>
            </MenuProvider>
            <Container fluid={true} className="header">
                <Container fluid={true} className={"background"}>
                    <Menu className={"branding"} text>
                        <a href="/"><img className="logo" src='/tasai-logo.svg' /></a>
                        <span className="title">Seeds Dashboard</span>
                        <Menu.Menu className={"pages"}>
                            <MyMenuItems
                                key="main-menu-items"
                                active={slug}
                                intl={intl}
                                selected={selected}
                                country={country}
                                setCountry={setCountry}
                                countries={data}
                                childMenu={childMenu}
                                setChildMenu={setChildMenu}
                                mainMenu={true}
                                menu={mainMenuItems['Main']}
                            >
                            </MyMenuItems>
                        </Menu.Menu>
                        <Menu.Item fitted className="lang">
                            <a href="">Français</a>
                        </Menu.Item>
                    </Menu>
                </Container>
                {
                    data.length && data.map((c, i) => {
                        return (
                            <MenuProvider key={'menu-provider-' + i + '-' + c.countryId} slug={c.iso}>
                                <MenuConsumer key={'menu-consumer-' + i + '-' + c.countryId}>
                                    <MenuExtractor type={'child'} setMenu={setMenu}></MenuExtractor>
                                </MenuConsumer>
                            </MenuProvider>
                        )
                    })
                }
                {
                    ((preview && preview.child_items) || (selected && selected.child_items)) && (childMenu === "Cross Country View" || childMenu === "Country View") &&
                    <Container fluid={true} className={"child"}>
                        <Menu fluid text>
                            <MyMenuItems
                                key="child-menu-items"
                                active={slug}
                                selected={selected}
                                intl={intl}
                                menu={{ items: preview ? preview.child_items:selected.child_items }}
                                mainMenu={false}
                            >
                            </MyMenuItems>
                        </Menu>
                    </Container>
                }
            </Container>
        </React.Fragment>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        country: state.get('data').getIn(['country']),
    }
}

const mapActionCreators = {
    setCountry: setCountry
};

export default connect(mapStateToProps, mapActionCreators)(injectIntl(withRouter(Header)))