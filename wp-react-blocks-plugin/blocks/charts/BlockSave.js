import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from '@wordpress/editor';
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
            methodology,
            totalLandArea,
            totalLandAreaUnit,
            arableLand,
            topHarvestedCropsAndValue_en,
            topHarvestedCropsAndValue_fr,
            topHarvestedCropsAndValueUnit,
            populationVsFarmingHouseholds,
            totalPopulationLabel,
            farmingHouseholdsLabel,
            sourceText_en,
            sourceText_fr,
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
             data-total-land-area-label={totalLandArea}
             data-total-land-area-unit={totalLandAreaUnit}
             data-total-arable-land-label={arableLand}
             data-top-harvested-crops-and-value_en={topHarvestedCropsAndValue_en}
             data-top-harvested-crops-and-value_fr={topHarvestedCropsAndValue_fr}
             data-top-harvested-crops-and-value-unit={topHarvestedCropsAndValueUnit}
             data-population-vs-farming-households={populationVsFarmingHouseholds}
             data-total-population-label={totalPopulationLabel}
             data-farming-households-label={farmingHouseholdsLabel}
             data-source-text_en={encodeURI(sourceText_en)}
             data-source-text_fr={encodeURI(sourceText_fr)}
        />
    );
}

export default SaveComponent
