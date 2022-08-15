import { useBlockProps } from '@wordpress/block-editor';

const SaveComponent = (props) => {

    const {
        attributes: {
            description, country, year, image, height, width, categorySuffix, isBrief
        }
    } = props;
    const blockProps = useBlockProps.save({
        className: 'wp-react-lib component chart'
    });

    return (<div className={"wp-react-lib-component self-render-component"}
                 data-component={"countryReports"}
                 data-description={description}
                 data-country={country}
                 data-image={image}
                 data-height={height}
                 data-width={width}
                 data-category-sufix={categorySuffix}
                 data-is-brief={isBrief}
                 data-year={year}>
    </div>);
}

export default SaveComponent
