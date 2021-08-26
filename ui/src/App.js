import React, {Component} from 'react';
import './App.scss';
import './wp/wp.scss';
import './scss/green.scss'
import {Provider} from 'react-redux'
import {Redirect, Route, Switch} from 'react-router' // react-router v4/v5
import {ConnectedRouter} from 'connected-react-router/immutable'
import getStore, {history} from './redux/store'
import messages_en from "./translations/en.json";
import {updateIntl} from 'react-intl-redux'
import {injectIntl, IntlProvider} from "react-intl";
import smoothscroll from 'smoothscroll-polyfill';
import ResponsiveContainer from './layout'
import {getComponentByNameIgnoreCase} from "./embeddable/index";
import {AppContextProvider, Category, Page, PageConsumer, PageProvider, Post, PostConsumer, PostProvider} from "@devgateway/wp-react-lib";
import queryString from "query-string";
import {Container, Segment} from "semantic-ui-react";

const store = getStore()

// kick off the polyfill!
smoothscroll.polyfill();

const messages = {
    'en': messages_en
};

const InjectTitle = injectIntl(({intl}) => {
    document.title = intl.formatMessage({id: 'app.title', defaultMessage: process.env.REACT_APP_TITLE})
    return null
})

class IntlRoutes extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const locale = this.props.match.params.lan
        store.dispatch(updateIntl({locale, messages: messages[this.props.match.params.lan]}))
    }
    componentDidUpdate() {
        const locale = this.props.match.params.lan
        store.dispatch(updateIntl({locale, messages: messages[locale]}))
    }
    render() {
        const self = this;
        const props = this.props;
        const locale = this.props.match.params.lan
        return (
            <IntlProvider key={locale} locale={locale} messages={messages[locale]}>
                <InjectTitle/>
                <AppContextProvider getComponent={getComponentByNameIgnoreCase} store={store} locale={locale}>
                    <Switch>
                        {
                            //Category Route
                        }
                        <Route path="/:lan/category/:slug/">
                            <ResponsiveContainer key="responsive-container-category">
                                <Category/>
                            </ResponsiveContainer>
                        </Route>
                        {
                            //default route (home)
                        }
                        <Route path="/:lan" exact render={props => (
                            <PageProvider
                                key="page-provider-default"
                                slug={"home"}
                                locale={locale}
                                store={"home"}>
                                <ResponsiveContainer key="responsive-container-default">
                                    <PageConsumer key="page-consumer-default">
                                        <Page key="page-default"></Page>
                                    </PageConsumer>
                                </ResponsiveContainer>
                            </PageProvider>
                        )}>
                        </Route>
                        <Route exact={true} path="/:lan/embeddable/:name" render={(props) => {
                            let params = queryString.parse(props.location.search)
                            const UIComponent = getComponentByNameIgnoreCase(props.match.params.name)
                            return (
                                <Container fluid={true}>
                                    {
                                        UIComponent ? <UIComponent {...params}></UIComponent> :
                                        <Segment color={"red"} textAlign={"center"}><h1>Wrong Component Name</h1></Segment>
                                    }
                                </Container>
                            )
                        }}>
                        </Route>
                        <Route path={"/:lan/preview/post/:id"} exact render={props => {
                            const searchParams = new URLSearchParams(props.location.search)
                            const preview = searchParams.get("preview")
                            const previewNonce = searchParams.get("_wpnonce")
                            return (
                                <ResponsiveContainer key="responsive-container-preview-post">
                                    <PostProvider store={"preview"} perPage={1} view={preview}
                                                  previewNonce={previewNonce} previewId={props.match.params.id}>
                                        <PostConsumer>
                                            <Post preview={true} showIntro={true}/>
                                        </PostConsumer>

                                    </PostProvider>
                                </ResponsiveContainer>
                            )
                        }}>
                        </Route>
                        <Route path={"/:lan/preview/page/:id"} exact render={props => {
                            const searchParams = new URLSearchParams(props.location.search)
                            const preview = searchParams.get("preview")
                            const previewNonce = searchParams.get("_wpnonce")
                            return (
                                <ResponsiveContainer key="responsive-container-preview-page">
                                    <PageProvider store={"preview"} perPage={1} view={preview}
                                                  previewNonce={previewNonce} previewId={props.match.params.id}>
                                        <PageConsumer key="page-consumer-preview-page">
                                            <Page preview={true} key="page-preview-page"/>
                                        </PageConsumer>

                                    </PageProvider>
                                </ResponsiveContainer>
                            )
                        }}>
                        </Route>
                        {
                            //page route
                        }
                        <Route path="/:lan/:slug/" exact render={props => {
                            return (
                                <PageProvider
                                    locale={locale}
                                    slug={props.match.params.slug}
                                    store={props.match.params.slug}>
                                    <ResponsiveContainer key="responsive-container-page">
                                        <PageConsumer key="page-consumer-page">
                                            <Page key="page-page"></Page>
                                        </PageConsumer>
                                    </ResponsiveContainer>
                                </PageProvider>
                            )
                        }}>
                        </Route>
                        {
                            //child route
                        }
                        <Route path="/:lan/:parent/:slug/" exact render={props => (
                            <PageProvider
                                locale={locale}
                                slug={props.match.params.slug}
                                store={props.match.params.slug}>
                                <ResponsiveContainer key="responsive-container-child">
                                    <PageConsumer key="page-consumer-child">
                                        <Page key="page-child"></Page>
                                    </PageConsumer>
                                </ResponsiveContainer>
                            </PageProvider>
                        )}>
                        </Route>
                        <Route path="/:lan/:year/:month/:day/:slug/" exact render={props => (
                            <ResponsiveContainer key="responsive-container-slug">
                                <PostProvider
                                    slug={props.match.params.slug}
                                    store={props.match.params.slug}
                                    locale={locale}
                                >
                                    <PostConsumer>
                                        <Post></Post>
                                    </PostConsumer>
                                </PostProvider>
                            </ResponsiveContainer>
                        )}>
                        </Route>
                    </Switch>
                </AppContextProvider>
            </IntlProvider>
        )
    }
}

const MainRoutes = (props) => {
    return (
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/:lan" render={(props) => <IntlRoutes {...props}/>}></Route>
                <Redirect to="/en"></Redirect>
            </Switch>
        </ConnectedRouter>
    )
}

class AppWrapper extends Component {
    render() {
        return (
            <Provider store={store}>
                <MainRoutes/>
            </Provider>
        );
    }
}

export default AppWrapper;
