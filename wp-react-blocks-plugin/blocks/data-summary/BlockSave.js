import { useBlockProps } from '@wordpress/block-editor';

const SaveComponent = (props) => {

    const {
        attributes: {
            title,
            numberLabel,
            ratingLabel,
            ratingAlignment,
            numberAlignment,
            ratingsMinimumFractionDigits,
            ratingMaximumFractionDigits,
            numberMinimumFractionDigits,
            numberMaximumFractionDigits
        }
    } = props;
    const blockProps = useBlockProps.save({
        className: 'wp-react-lib component chart'
    });

    const divClass = {}
    const divStyles = {}
    return (
        <div className={"wp-react-lib-component"}
             data-component={"dataSummary"}
             data-title={title}
             data-rating-label={ratingLabel}
             data-number-label={numberLabel}
             data-rating-alignment={ratingAlignment}
             data-number-alignment={numberAlignment}
             data-rating-minimum-fraction-digits={ratingsMinimumFractionDigits}
             data-rating-maximum-fraction-digits={ratingMaximumFractionDigits}
             data-number-minimum-fraction-digits={numberMinimumFractionDigits}
             data-number-maximum-fraction-digits={numberMaximumFractionDigits}
        >
        </div>


    );
}


export default SaveComponent
