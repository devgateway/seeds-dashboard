import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/editor';

const SaveComponent = (props) => {
    const {
        toggleSelection, setAttributes, attributes: {
            height,
            width,
            type,
            title_en,
            title_fr,
            sourceText_en,
            sourceText_fr,
        }
    } = props;
    const blockProps = useBlockProps.save({
        className: 'wp-react-lib component map'
    });
    const divClass = {}
    const divStyles = {}
    return (
        <div className={"wp-react-lib-component"}
             data-component={"map"}
             data-height={height}
             data-width={width}
             data-map-type={type}
             data-title_en={title_en}
             data-source-text_en={encodeURI(sourceText_en)}
             data-source-text_fr={encodeURI(sourceText_fr)}
        />
    );
}

export default SaveComponent
