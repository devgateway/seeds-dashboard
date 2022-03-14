import { useBlockProps } from '@wordpress/block-editor';

const SaveComponent = (props) => {

    const {
        attributes: {
            behavior, label
        }
    } = props;
    const blockProps = useBlockProps.save({
        className: 'wp-react-lib component chart'
    });

    const divClass = {}
    const divStyles = {}
    return (
        <div className={"wp-react-lib-component"}
             data-component={"backToTop"}
             data-behavior={behavior}
             data-label={label}
        >
        </div>


    );
}


export default SaveComponent
