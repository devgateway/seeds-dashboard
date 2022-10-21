import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/editor';

const SaveComponent = (props) => {
    const {
        toggleSelection, setAttributes, attributes: {
            height,
            width,
            type,
            title,
            sourceText_en,
            sourceText_fr,
            methodology,
            download
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
             data-title={title}
             data-source-text_en={encodeURI(sourceText_en)}
             data-source-text_fr={encodeURI(sourceText_fr)}
             data-download={download}
             data-methodology={methodology}
        />
    );
}

export default SaveComponent
