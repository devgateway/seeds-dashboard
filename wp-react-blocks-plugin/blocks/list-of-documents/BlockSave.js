import {useBlockProps} from '@wordpress/block-editor';

const SaveComponent = (props) => {

    const {
        attributes: {
            type,
            showInline,
            category,
            noDataText
        }
    } = props;
    const blockProps = useBlockProps.save({
        className: 'wp-react-lib component chart'
    });

    const divClass = {}
    const divStyles = {}
    return (
        <div className={"wp-react-lib-component"}
             data-component={"listOfDocuments"}
             data-type={type}
             data-show-inline={showInline}
             data-no-data-text={noDataText}
             data-category={category}>
        </div>
    );
}

export default SaveComponent
