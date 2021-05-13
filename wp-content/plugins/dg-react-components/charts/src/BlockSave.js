import {InspectorControls, useBlockProps} from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/editor'; // or wp.editor
const SaveComponent = (props) => {
    const {
        toggleSelection, setAttributes, attributes: {
            height,
            width,
            type,
            groupMode,
            bottomLegend,
            leftLegend,
            scheme,
            colorBy,
            level1,
            level2,
            level3,
            dualMode
        }
    } = props;
    const blockProps = useBlockProps.save({
        className: 'tcdi component chart'
    });

    const divClass = {}
    const divStyles = {}
    const levels = [level1, level2, level3];
    const source = levels.filter(l => l != 'none' && l != null).join('/')
    const sourceFixed = type + "/" + source


    return (
            <div className={"tcdi-component"}
                 data-component={"chart"}
                 data-height={height}
                 data-chart-type={type}
                 data-source={sourceFixed}
                 data-color-by={colorBy}
                 data-color-scheme={scheme}
                 data-scheme={scheme}
                 data-group-mode={groupMode}
                 data-legends-left={leftLegend}
                 data-dualMode={dualMode}
                 data-legends-bottom={bottomLegend}>

                <InnerBlocks.Content/>
            </div>



    );
}


export default SaveComponent