import React, {useEffect} from "react";
import {Container, Grid, GridColumn, GridRow} from "semantic-ui-react";
import {connect} from "react-redux";
import {getDocuments, getImages, getWpCategories, getCrops} from "../reducers/data";
import {
    DATA, SELECTED_COUNTRY, WP_CATEGORIES, WP_DOCUMENTS, DATA_CATEGORY, WP_IMAGES, WP_CROPS
} from "../reducers/StoreConstants";
import './styles.scss';
import CropsLegend from "../chart/common/crop";

const DOCUMENTS_PER_PAGE = 100;

const CountryReports = ({
                            onLoadDocuments,
                            onLoadCategories,
                            onLoadImages,
                            onLoadCrops,
                            crops,
                            documents,
                            loading,
                            error,
                            "data-description": description,
                            "data-country": country,
                            categoriesWP,
                            selectedCountry: selectedCountryId,
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
        if (categoriesWP && country && year) {
            const year_ = categoriesWP.find(i => i.id === Number(year)).name;
            const country_ = categoriesWP.find(i => i.id === Number(country)).name;
            const params = {country: country_, year: year_};
            onLoadCrops({params});
        }
    }, [onLoadCrops, categoriesWP, country, year]);

    useEffect(() => {
        const params = {};
        params.per_page = DOCUMENTS_PER_PAGE;
        onLoadImages({params})
    }, [onLoadImages]);

    const generateLinks = () => {
        if (documents && categoriesWP) {
            const docs = documents.filter(d => d.mime_type === 'application/pdf' && d.categories.find(i => i === Number(year)) && d.categories.find(i => i === Number(country)));
            if (docs.length === 0) {
                return null;
            }
            const langsCat = categoriesWP.find(i => i.name === 'languages');
            const enLang = categoriesWP.find(i => i.name === 'en' && i.parent === langsCat.id);
            const frLang = categoriesWP.find(i => i.name === 'fr' && i.parent === langsCat.id);
            const links = [];
            docs.filter(i => i.categories.find(j => j === enLang.id)).forEach(i => {
                links.push({lang: 'English', link: i.source_url});
            });
            docs.filter(i => i.categories.find(j => j === frLang.id)).forEach(i => {
                links.push({lang: 'French', link: i.source_url});
            });
            if (links.length === 1) {
                return (<div className="links-container">
                    <a href={links[0].link}>View Report</a>
                </div>);
            } else {
                return (<div className="links-container">
                    <span>View Report -</span>
                    {links.map((i, index) => {
                        return <a key={i.link} href={i.link}>{i.lang}{index === 0 ? '  /  ' : ''}</a>
                    })}
                </div>);
            }
        }
        return null;
    }

    const getCrops = () => {
        if (crops) {
            if (crops.crop1 || crops.crop2 || crops.crop3 || crops.crop4) {
                const data = [crops.crop1 || '', crops.crop2 || '', crops.crop3 || '', crops.crop4 || ''];
                return <CropsLegend data={data}/>;
            }
        }
        return <span>No crops data</span>;
    }

    const classes = 'styles reports';
    let childComponent = null;

    if (loading || !categoriesWP) {
        childComponent = (<div>Loading...</div>);
    } else if (year && country) {
        const year_ = categoriesWP.find(i => i.id === Number(year));
        const country_ = categoriesWP.find(i => i.id === Number(country));
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
                                {getCrops()}
                            </div>
                            <div className="report-container">
                                <span className="title">{country_.name + ' ' + year_.name + ' Report'}</span>
                                <span className="description">{description}</span>
                                <span className="links">{generateLinks()}</span>
                            </div>
                        </div>
                    </GridColumn>
                </GridRow>
            </Grid>
        </div>);
    } else {
        childComponent = (<div>Please select Country, Year and Language to show the component preview.</div>);
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
        crops: state.getIn([DATA, ownProps[DATA_CATEGORY], WP_CROPS, 'data']),
    }
}

const mapActionCreators = {
    onLoadDocuments: getDocuments, onLoadCategories: getWpCategories, onLoadImages: getImages, onLoadCrops: getCrops,
};

export default connect(mapStateToProps, mapActionCreators)(CountryReports)
