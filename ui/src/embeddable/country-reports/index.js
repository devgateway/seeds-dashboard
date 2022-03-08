import React, {useEffect} from "react";
import {Container, Grid, GridColumn, GridRow} from "semantic-ui-react";
import {connect} from "react-redux";
import {getDocuments, getImages, getWpCategories} from "../reducers/data";
import {
    DATA, SELECTED_COUNTRY, WP_CATEGORIES, WP_DOCUMENTS, DATA_CATEGORY, WP_IMAGES
} from "../reducers/StoreConstants";
import './styles.scss';
import CropsLegend from "../chart/common/crop";

const DOCUMENTS_PER_PAGE = 100;

const CountryReports = ({
                            onLoadDocuments,
                            onLoadCategories,
                            onLoadImages,
                            documents,
                            loading,
                            error,
                            "data-description": description,
                            "data-country": country,
                            categoriesWP,
                            selectedCountry: selectedCountryId,
                            "data-language": language,
                            "data-year": year,
                            "data-image": image,
                            editing,
                            "data-width": width,
                            "data-height": height,
                        }) => {
    useEffect(() => {
        onLoadCategories()
    }, [onLoadCategories]);

    useEffect(() => {
        if (categoriesWP && !loading) {
            const params = {};
            params.per_page = DOCUMENTS_PER_PAGE;
            onLoadDocuments({params})
        }
    }, [categoriesWP, onLoadDocuments]);

    useEffect(() => {
        const params = {};
        params.per_page = DOCUMENTS_PER_PAGE;
        onLoadImages({params})
    }, [onLoadImages]);

    const classes = 'styles reports';
    let childComponent = null;

    if (!loading && categoriesWP && year && country && language) {
        const year_ = categoriesWP.find(i => i.id === Number(year));
        const country_ = categoriesWP.find(i => i.id === Number(country));
        const language_ = categoriesWP.find(i => i.id === Number(language));
        childComponent = (<div className="box" style={{width: width + 'px', height: height + 'px'}}>
            <Grid>
                <GridRow>
                    <GridColumn width={5}>
                        <div className="image">
                            <img
                                src="https://www.researchgate.net/profile/Zahir-Dehouche/publication/324114338/figure/fig1/AS:621209800671234@1525119366926/Pictures-of-nine-common-Nigerian-food-crops-and-their-various-waste-products.png"
                                width='180px'
                            />
                        </div>
                    </GridColumn>
                    <GridColumn width={11}>
                        <div>
                            <div className="crops">
                                <CropsLegend data={['maize', 'bean', 'rice', 'sorghum']}/>
                            </div>
                            <div className="report-container">
                                <span className="title">{country_.name + ' ' + year_.name + ' Report'}</span>
                                <span className="description">{description}</span>
                            </div>
                        </div>
                    </GridColumn>
                </GridRow>
            </Grid>
        </div>);
    } else {
        childComponent = (<div>Loading...</div>);
    }
    return <Container fluid={true} className={classes}>{childComponent}</Container>
}

const mapStateToProps = (state, ownProps) => {
    return {
        documents: state.getIn([DATA, ownProps[DATA_CATEGORY], WP_DOCUMENTS, 'data']),
        loading: state.getIn([DATA, ownProps[DATA_CATEGORY], WP_DOCUMENTS, 'loading']),
        error: state.getIn([DATA, ownProps[DATA_CATEGORY], WP_DOCUMENTS, 'error']),
        categoriesWP: state.getIn([DATA, WP_CATEGORIES]),
        selectedCountry: state.getIn([DATA, 'filters', SELECTED_COUNTRY]),
        images: state.getIn([DATA, ownProps[DATA_CATEGORY], WP_IMAGES, 'data']),
    }
}

const mapActionCreators = {
    onLoadDocuments: getDocuments, onLoadCategories: getWpCategories, onLoadImages: getImages
};

export default connect(mapStateToProps, mapActionCreators)(CountryReports)
