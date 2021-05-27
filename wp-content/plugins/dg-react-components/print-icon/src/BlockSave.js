import {useBlockProps} from '@wordpress/block-editor';

const SaveComponent = (props) => {

    const {
        attributes: {
            icon,
            htmlId,
            size,
            color
        }
    } = props;
    const blockProps = useBlockProps.save({
        className: 'tcdi component chart'
    });

    const divClass = {}
    const divStyles = {}

    return (
        <div className={"tcdi-component"}
             data-component={"print"}

             data-icon={icon}
             data-htmlId={htmlId}
             data-size={size}
             data-color={color}
        >
        </div>
    );
}


export default SaveComponent