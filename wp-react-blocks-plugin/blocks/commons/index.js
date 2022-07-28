import { __ } from '@wordpress/i18n';
import { CheckboxControl, PanelBody, PanelRow, SelectControl, TextControl } from '@wordpress/components';
import { Component } from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch';


export const SizeConfig = ({ height, setAttributes, initialOpen }) => {
    return (<PanelBody initialOpen={initialOpen} title={__("Size")}>
        <PanelRow>
            <TextControl
                size={10}
                label="Height"
                value={height}
                onChange={(height) => setAttributes({ height: height ? parseInt(height) : 0 })}
            />
        </PanelRow>
    </PanelBody>)

}
export const ConnectFilterConfig = ({
                                        setAttributes,
                                        connectFilter,
                                        valuesFilterStore,
                                        selectedFilterStore,
                                        title
                                    }) => {
    return <PanelBody title={__(title)}>
        <PanelRow>
            <CheckboxControl
                label={__('Connect filter component')}
                checked={connectFilter}
                onChange={() => setAttributes({ connectFilter: !connectFilter })} />
        </PanelRow>
        {connectFilter && <PanelRow>
            <TextControl
                label={__('Values store')}
                value={valuesFilterStore}
                onChange={(valuesFilterStore) => setAttributes({ valuesFilterStore })}
            /></PanelRow>}
        {connectFilter && <PanelRow>
            <TextControl
                label={__('selected filter store')}
                value={selectedFilterStore}
                onChange={(selectedFilterStore) => setAttributes({ selectedFilterStore })}
            /></PanelRow>}
    </PanelBody>

}

export class BaseBlockEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            react_ui_url: ''
        }
    }

    componentDidMount() {
        apiFetch({ path: '/wp/v2/settings' }).then((data) => {
            this.setState({
                react_ui_url: data["react_ui_url"],
                site_language: data["site_language"],
                current_language: new URLSearchParams(document.location.search).get("edit_lang")
            });
        });

        fetchAll('/wp/v2/categories', 'categories', this);
        fetchAll('/wp/v2/media', 'images', this);
    }
}

const fetchAll = (url, field, this_) => {
    let data = [];
    const pageSize = 100;
    let page = 1;
    fetch(url, page, data, pageSize).then(() => {
        this_.setState({
            [field]: data
        });
    });
}

const fetch = (url, page, data, pageSize) => {
    return apiFetch({ path: url + '?per_page=' + pageSize + '&page=' + page }).then((d) => {
        data.push(...d);
        if (d.length === pageSize) {
            return fetch(url, page + 1, data, pageSize);
        }
    });
}

export class BlockEditWithFilters extends BaseBlockEdit {

    constructor(props) {
        super(props);
        this.state = {
            taxonomyValues: [],
            types: null,
            taxonomies: null,
            loading: true
        }
        this.onTypeChanged = this.onTypeChanged.bind(this)
        this.onTaxonomyChanged = this.onTaxonomyChanged.bind(this)
        this.getTaxonomyValues = this.getTaxonomyValues.bind(this)
        this.onCategoryChanged = this.onCategoryChanged.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            setAttributes,
            attributes: {
                type,
                taxonomy,
                count
            },
        } = this.props;

        if (prevProps.attributes) {
            if (type != prevProps.attributes.type) {

            }
            if (taxonomy != prevProps.attributes.taxonomy) {
                this.getTaxonomyValues()

            }
        }

    }

    componentDidMount() {
        super.componentDidMount()
        this.getTypes();
        this.getTaxonomies()

        const {
            setAttributes,
            attributes: {
                type,
                taxonomy,
                count
            },
        } = this.props;


        if (taxonomy != 'none') {
            this.getTaxonomyValues()

        }

    }

    onTypeChanged(value) {
        const { setAttributes } = this.props
        setAttributes({ categories: [] })
        setAttributes({ taxonomy: 'none' })
        setAttributes({ type: value })
    }

    onTaxonomyChanged(value) {
        const { setAttributes } = this.props
        setAttributes({ categories: [] })
        setAttributes({ taxonomy: value })

    }

    onCategoryChanged(checked, value) {
        const { setAttributes, attributes: { categories } } = this.props
        if (!checked) {
            setAttributes({ categories: categories.filter(i => i != value) })
        } else {
            let newCate = [...categories]
            newCate.push(value)
            setAttributes({ categories: newCate })
        }

    }

    getTaxonomyValues() {
        const {
            setAttributes,
            attributes: {
                type,
                taxonomy,
                count
            },
        } = this.props;
        /*wp.apiFetch({
            path: '/wp/v2/' + taxonomy + '?per_page=100',
        })*/
        this.getAll('/wp/v2/' + taxonomy).then(data => {

            this.setState({ taxonomyValues: data });
        });
    }

    getAll(url) {
        const pageSize = 100;
        let page = 1;
        const data = [];
        return new Promise((resolve, reject) => {
            return this.getNextPage(url, page, data, pageSize).then(() => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });

    }

    getNextPage = (url, page, data, pageSize) => {

        return wp.apiFetch({
            path: url + '?per_page=' + pageSize + '&page=' + page,
        }).then((data_) => {
            data.push(...data_);
            if (data_.length === pageSize) {
                return this.getNextPage(url, page + 1, data, pageSize);
            }
            return;
        });
    }

    getTaxonomies() {

        wp.apiFetch({
            path: '/wp/v2/taxonomies?per_page=100',
        }).then(data => {
            this.setState({
                taxonomies: data,
            });
        });
    }

    getTypes() {
        wp.apiFetch({
            path: '/wp/v2/types?per_page=100',
        }).then(data => {
            const types = data
            this.setState({
                types: data,
                loading: false
            });
        });
    }

    typeOptions() {
        const {
            setAttributes,
            attributes: {
                count,
                type,
                taxonomy,
                category
            },
        } = this.props;
        const { types, taxonomies, taxonomyValues } = this.state
        const typeOptions = types ? Object.keys(types)
            .filter(k => ['page', 'attachment', 'wp_block']
                .indexOf(k) === -1).map(k => ({
                slug: types[k].slug,
                label: types[k].name,
                value: types[k].rest_base
            })) : []

        return typeOptions

    }

    taxonomyOptions() {
        const {
            attributes: {
                type,
            },
        } = this.props;
        const { types, taxonomies, taxonomyValues } = this.state
        let slug;
        if (types) {
            slug = this.typeOptions().filter(t => t.value == type)[0].slug

            const taxonomyOptions = types && taxonomies ? Object.keys(taxonomies)
                .filter(i => taxonomies[i].types.indexOf(slug) > -1).map(k => ({
                    label: types[slug].name + ' -> ' + taxonomies[k].name,
                    value: taxonomies[k].rest_base
                })) : []

            return [{ label: 'None', value: 'none' }, ...taxonomyOptions]
        } else {
            return []
        }
    }

    categoriesOptions() {
        const { types, taxonomies, taxonomyValues } = this.state
        const taxonomyValuesOptions = taxonomyValues && taxonomyValues.map(t => ({ label: t.name, value: t.id }))
        console.log(taxonomyValuesOptions)
        return taxonomyValuesOptions
    }


    renderFilters() {
        const {
            attributes: {
                type,
                taxonomy,
                categories,

            }
        } = this.props
        return (<PanelBody title={__("Filter")}>
            <PanelRow>
                <SelectControl
                    label={__("Post Type")} options={this.typeOptions()}
                    value={type}
                    onChange={this.onTypeChanged} />
            </PanelRow>
            <PanelRow>

                <SelectControl label={__("Use a taxonomy filter ")} options={this.taxonomyOptions()}
                               value={taxonomy}
                               onChange={this.onTaxonomyChanged}
                />
            </PanelRow>
            {taxonomy !== 'none' && this.categoriesOptions().map(o => {
                return <PanelRow><CheckboxControl
                    label={o.label}
                    onChange={(checked) => this.onCategoryChanged(checked, o.value)}
                    checked={categories.indexOf(o.value) > -1}
                /></PanelRow>
            })}
        </PanelBody>)

    }
}

export default SizeConfig

