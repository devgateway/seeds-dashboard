import {useBlockProps} from '@wordpress/block-editor';

const SaveComponent = (props) => {

    const {
        attributes: {
            description, country, year, image, language
        }
    } = props;
    const blockProps = useBlockProps.save({
        className: 'wp-react-lib component chart'
    });

    return (<div className={"wp-react-lib-component"}
                 data-component={"countryReports"}
                 data-description={description}
                 data-country={country}
                 data-language={language}
                 data-image={image}
                 data-year={year}>
    </div>);
}

export default SaveComponent
