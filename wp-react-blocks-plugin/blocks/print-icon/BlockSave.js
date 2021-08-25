import {useBlockProps} from '@wordpress/block-editor';

const SaveComponent = (props) => {
    const {
        attributes: {
            icon,
            htmlClass,
            size,
            color,
            downloadName
        }
    } = props;
    const blockProps = useBlockProps.save({
        className: 'wp-react-lib component chart'
    });
    const divClass = {}
    const divStyles = {}
    return (
        <div
            className={"wp-react-lib-component"}
            data-component={"print"}
            data-icon={icon}
            data-htmlClass={htmlClass}
            data-size={size}
            data-color={color}
            data-downloadName={downloadName}
        >
        </div>
    );
}

export default SaveComponent