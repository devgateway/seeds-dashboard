import React from 'react';
import { connect } from 'react-redux';
import { loadTaxonomy } from '../reducers/actions';
import { TaxonomyContext } from './Context';

class TaxonomyProvider extends React.Component {
  componentDidMount() {
    //TODO: pass locale
    if (this.props.taxonomies.length == 0) {
      this.props.onLoad(this.props.taxonomy ? this.props.taxonomy : 'categories');
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    const {
      taxonomies,
      loading
    } = this.props;

    if (taxonomies) {
      return /*#__PURE__*/React.createElement(TaxonomyContext.Provider, {
        value: taxonomies
      }, this.props.children);
    } else {
      return /*#__PURE__*/React.createElement("h3", null, "Loading");
    }
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    taxonomies: state.getIn(['wordpress', ownProps.taxonomy ? ownProps : 'categories', 'items']) ? state.getIn(['wordpress', ownProps.taxonomy ? ownProps : 'categories', 'items']).toJS() : [],
    loading: state.getIn(['wordpress', ownProps.taxonomy ? ownProps : 'categories', 'loading'])
  };
};

const mapActionCreators = {
  onLoad: loadTaxonomy
};
export default connect(mapStateToProps, mapActionCreators)(TaxonomyProvider);