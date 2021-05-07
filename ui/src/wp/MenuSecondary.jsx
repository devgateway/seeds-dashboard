import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {injectIntl} from 'react-intl';
import {getMenu} from './module'
import {withRouter} from 'react-router' // react-router v4/v5
import withTracker from "../withTracker"

import {Button, Flag, Grid, Header, Icon, Input, Menu, Popup,} from 'semantic-ui-react'

import './menu.scss'

const getLink = (o, locale) => {
    switch (o.type_label.toUpperCase()) {
        case 'POST':
            return `#${locale}/posts/${o.slug}`;
        case 'PAGE':
            return `#${locale}/${o.slug}`;
        default:
            return `#${locale}${o.url}`;
    }
}

const getLabel = (e, locale) => {
    if (e.url == '/') {
        return (<a href="/"><Icon name="home"/></a>)
    } else {
        return <a href={getLink(e, locale)}>
            <div dangerouslySetInnerHTML={{__html: e.title}}/>
        </a>
    }
}


function ItemsWalker({items, locale}) {
    return (<Menu.Menu>{items && items.sort((a, b) => a.menu_order - b.menu_order).map(e =>

        <Menu.Item key={e.ID}
                   name='features'
                   active={false}>

            {e.child_items ?
                <Popup flowing trigger={<div dangerouslySetInnerHTML={{__html: e.title}}/>} flowing hoverable>
                    <Grid centered divided stackable columns={e.child_items.length}>

                        {e.child_items.map(e1 =>
                            <Grid.Column key={e1.title} textAlign='center'>
                                <Header as='h4'><span dangerouslySetInnerHTML={{__html: e1.title}}/></Header>
                                <Button><a href={getLink(e1, locale)}>Click here to see more</a></Button>
                            </Grid.Column>
                        )}
                    </Grid>
                </Popup> : getLabel(e, locale)
            }
        </Menu.Item>
    )}

    </Menu.Menu>)
}


const MenuWrapper = (props) => {
    const {onLoad, loading, location, slug, intl, fixed, mobile, items} = props

    const activeItem = null


    useEffect(() => {
        onLoad(slug)
    }, [onLoad, slug]);


    return (
      <div className="secondary-menu">
      <Menu className="secondary" text stackable fixed={fixed ? 'top' : null}>
        <Menu.Menu>
            <ItemsWalker items={items ? items.items : null} locale={intl.locale}/>
        </Menu.Menu>
    </Menu>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
    const slug = ownProps.slug
    return {
        error: state.getIn(['wordpress', 'menu', slug, 'error']),
        items: state.getIn(['wordpress', 'menu', slug, 'items']),
        loading: state.getIn(['wordpress', 'menu', slug, 'loading'])
    }
}

const mapActionCreators = {
    onLoad: getMenu
};

export default injectIntl(withRouter(connect(mapStateToProps, mapActionCreators)(withTracker(MenuWrapper))));
