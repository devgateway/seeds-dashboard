import {useBlockProps} from '@wordpress/block-editor';

const SaveComponent = (props) => {

    const {
        attributes: {
            description, country, year, image, height, width
        }
    } = props;
    const blockProps = useBlockProps.save({
        className: 'wp-react-lib component chart'
    });

    return (<div className={"wp-react-lib-component"}
                 data-component={"countryReports"}
                 data-description={description}
                 data-country={country}
                 data-image={image}
                 data-height={height}
                 data-width={width}
                 data-year={year}>
    </div>);
}

export default SaveComponent
