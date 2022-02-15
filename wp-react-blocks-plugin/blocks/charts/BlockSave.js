import {InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {InnerBlocks} from '@wordpress/editor';
import ApiConfigurations from "./ApiConfiguration.json";

const SaveComponent = (props) => {
    const {
        toggleSelection, setAttributes, attributes: {
            height,
            width,
            type,
            dualMode,
            download,
            sources,
            mostRecentYears,
            defaultCountryId,
            layout,
            groupMode,
            title,
            subTitle,
            useSourceByCategory,
            methodology
        }
    } = props;
    const blockProps = useBlockProps.save({
        className: 'wp-react-lib component chart'
    });
    const divClass = {}
    const divStyles = {}
    return (
        <div className={"wp-react-lib-component"}
             data-component={"chart"}
             data-height={height}
             data-width={width}
             data-chart-type={type}
             data-dualMode={dualMode}
             data-download={download}
             data-sources={sources}
             data-title={title}
             data-sub-title={subTitle}
             data-most-recent-years={mostRecentYears}
             data-default-country-id={defaultCountryId}
             data-layout={layout}
             data-group-mode={groupMode}
             data-chart-data-source={ApiConfigurations[type] ? ApiConfigurations[type].join("|") : undefined}
             data-use-source-by-category={useSourceByCategory}
             data-methodology={methodology}
        />
    );
}

export default SaveComponent
