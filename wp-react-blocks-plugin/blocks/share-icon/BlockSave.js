import {useBlockProps} from '@wordpress/block-editor';

const SaveComponent = (props) => {
    const {
        attributes: {
            icon
        }
    } = props;
    const blockProps = useBlockProps.save({
        className: 'wp-react-lib component share'
    });
    const divClass = {}
    const divStyles = {}
    return (
        <div
            className={"wp-react-lib-component"}
            data-component={"share"}
            data-icon={icon}
        >
        </div>
    );
}

export default SaveComponent