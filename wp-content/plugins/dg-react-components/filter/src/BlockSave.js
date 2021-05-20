import {useBlockProps} from '@wordpress/block-editor';

const SaveComponent = (props) => {

    const {
        attributes: {
            placeHolder,
            type,
            param,
            multi
        }
    } = props;
    const blockProps = useBlockProps.save({
        className: 'tcdi component chart'
    });

    const divClass = {}
    const divStyles = {}


    return (
        <div className={"tcdi-component"}
             data-component={"filter"}

             data-type={type}
             data-param={param}
             data-placeholder={placeHolder}
             data-multi={multi}
        >


        </div>


    );
}


export default SaveComponent