import {useBlockProps} from '@wordpress/block-editor';

const SaveComponent = (props) => {

    const {
        attributes: {
            icon
        }
    } = props;
    const blockProps = useBlockProps.save({
        className: 'tcdi component share'
    });

    const divClass = {}
    const divStyles = {}

    return (
        <div className={"tcdi-component"}
             data-component={"share"}

             data-icon={icon}
        >
        </div>
    );
}


export default SaveComponent