import { Component } from '@wordpress/element'
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
    Panel,
    PanelBody,
    PanelRow,
    ResizableBox,
    SelectControl,
    RangeControl,
    TextControl,
    ToggleControl,
    TextareaControl
} from '@wordpress/components';
import { InnerBlocks } from '@wordpress/editor'; // or wp.editor
import { __ } from '@wordpress/i18n';
import { Checkbox } from 'semantic-ui-react'
import { BaseBlockEdit } from "../commons";
import ApiConfigurations from './ApiConfiguration.json';

class BlockEdit extends BaseBlockEdit {
    render() {
        const {
            className, isSelected,
            toggleSelection, setAttributes, attributes: {
                height,
                width,
                type,
                dualMode,
                mode,
                download,
                sources,
                title,
                subTitle,
                mostRecentYears,
                defaultCountryId,
                layout,
                groupMode,
                useSourceByCategory,
                methodology,
                totalLandArea_en,
                totalLandArea_fr,
                arableLand_en,
                arableLand_fr,
                totalLandAreaUnit_en,
                totalLandAreaUnit_fr,
                topHarvestedCropsAndValue_en,
                topHarvestedCropsAndValue_fr,
                topHarvestedCropsAndValueUnit,
                populationVsFarmingHouseholds_en,
                populationVsFarmingHouseholds_fr,
                totalPopulationLabel_en,
                totalPopulationLabel_fr,
                farmingHouseholdsLabel_en,
                farmingHouseholdsLabel_fr,
                sourceText_en,
                sourceText_fr,
            }
        } = this.props;
        let queryString = `data-height=${height}`;
        queryString += `&data-chart-type=${type}`;
        queryString += `&data-dualmode=${dualMode}`;
        queryString += `&data-download=${download}`;
        queryString += `&data-sources=${sources}`;
        queryString += `&data-title=${title}`;
        queryString += `&data-sub-title=${subTitle}`
        queryString += `&data-most-recent-years=${mostRecentYears}`;
        queryString += `&data-default-country-id=${defaultCountryId}`;
        queryString += `&data-layout=${layout}`;
        queryString += `&data-group-mode=${groupMode}`;
        queryString += `&data-use-source-by-category=${useSourceByCategory}`;
        queryString += `&data-methodology=${methodology}`;
        queryString += `&data-total-population-label_en=${totalPopulationLabel_en}`;
        queryString += `&data-total-population-label_fr=${totalPopulationLabel_fr}`;
        queryString += `&data-farming-households-label_en=${farmingHouseholdsLabel_en}`
        queryString += `&data-farming-households-label_fr=${farmingHouseholdsLabel_fr}`

        queryString += `&data-total-land-area-label_en=${totalLandArea_en}`;
        queryString += `&data-total-land-area-label_fr=${totalLandArea_fr}`;
        queryString += `&data-total-land-area-unit_en=${totalLandAreaUnit_en}`;
        queryString += `&data-total-land-area-unit_fr=${totalLandAreaUnit_fr}`;

        queryString += `&data-total-arable-land-label_en=${arableLand_en}`;
        queryString += `&data-total-arable-land-label_fr=${arableLand_fr}`;
        queryString += `&data-top-harvested-crops-and-value_en=${topHarvestedCropsAndValue_en}`;
        queryString += `&data-top-harvested-crops-and-value_fr=${topHarvestedCropsAndValue_fr}`;
        queryString += `&data-top-harvested-crops-and-value-unit=${topHarvestedCropsAndValueUnit}`;
        queryString += `&data-population-vs-farming-households_en=${populationVsFarmingHouseholds_en}`;
        queryString += `&data-population-vs-farming-households_fr=${populationVsFarmingHouseholds_fr}`;

        queryString += `&data-source-text_en=${sourceText_en}`;
        queryString += `&data-source-text_fr=${sourceText_fr}`;

        if (ApiConfigurations[type]) {
            queryString += ` & data - chart - data - source =${ApiConfigurations[type].join("|")}`;
        }
        queryString += ` & editing = true`
        const divStyles = { height: height + 'px', width: '100%' }
        return (
            [isSelected && (
                <InspectorControls>
                    <Panel header={__("Chart Configuration")}>
                        <PanelBody>
                            <PanelRow>
                                <SelectControl
                                    label={__('Indicator:')}
                                    value={[type]}
                                    onChange={(type) => {
                                        setAttributes({ type })
                                    }}
                                    options={[
                                        { label: 'Country Info', value: 'countryInfo' },
                                        {
                                            label: 'Market share of top four seed companies',
                                            value: 'marketShareTopFourSeedCompanies'
                                        },
                                        {
                                            label: 'Market share of state-owned seed companies',
                                            value: 'marketShareStateOwnedSeedCompanies'
                                        },
                                        {
                                            label: 'Number of varieties released in last 3 years',
                                            value: 'numberOfVarietiesReleased'
                                        },
                                        {
                                            label: 'Market Concentration HHI',
                                            value: 'marketConcentrationHHI'
                                        },
                                        {
                                            label: 'Varieties released with special features',
                                            value: 'varietiesReleasedWithSpecialFeatures'
                                        },
                                        {
                                            label: 'Availability of basic seed',
                                            value: 'availabilityOfBasicSeed'
                                        },
                                        {
                                            label: 'Average Age of Varieties Sold',
                                            value: 'avgAgeVarietiesSold'
                                        },
                                        {
                                            label: 'Number of active breeders and adequacy of breeders',
                                            value: 'numberActiveBreeders'
                                        },
                                        {
                                            label: 'Number of active seed companies/producers',
                                            value: 'numberActiveCompanies'
                                        },
                                        {
                                            label: 'Number of varieties sold in data collection year',
                                            value: 'numberVarietiesSold'
                                        },
                                        {
                                            label: 'Efficiency of seed import process',
                                            value: 'efficiencyOfSeedImportProcess'
                                        },
                                        {
                                            label: 'Member assessment of the performance of the national seed association',
                                            value: 'performanceSeedTraders'
                                        },
                                        {
                                            label: 'Efficiency of seed export process',
                                            value: 'efficiencyOfSeedExportProcess'
                                        },
                                        {
                                            label: 'Number of seed inspectors',
                                            value: 'numberSeedInspectors'
                                        },
                                        {
                                            label: 'Quantity of certified seed sold (metric tons)',
                                            value: 'quantityCertifiedSeedSold'
                                        },
                                        {
                                            label: 'Length of variety release process',
                                            value: 'varietyReleaseProcess'
                                        },
                                        {
                                            label: 'Satisfaction with the enforcement of seed law/ regulations (opinion)',
                                            value: 'satisfactionEnforcementSeedLaw'
                                        },
                                        {
                                            label: 'Availability of seed in small packages',
                                            value: 'availabilitySeedSmallPackages'
                                        },
                                        {
                                            label: 'Price of seed at planting',
                                            value: 'priceSeedPlanting'
                                        },
                                        {
                                            label: 'Concentration of agro-dealer network',
                                            value: 'agrodealerNetwork'
                                        },
                                        {
                                            label: 'Availability of agricultural extension services for smallholder farmers',
                                            value: 'agriculturalExtensionServices'
                                        },
                                        {
                                            label: 'Cross-Country - Number of seed inspectors in most recent data collection year',
                                            value: 'seedInspectorsByCountry',
                                        },
                                        {
                                            label: 'Cross-Country - Number of active breeders',
                                            value: 'numberActiveBreeders_crossCountry'
                                        },
                                        {
                                            label: 'Cross-Country - Number of varieties released in last 3 years by land under production',
                                            value: 'numberOfVarietiesReleased_crossCountry'
                                        },
                                        {
                                            label: 'Cross-Country - Quantity of certified seed sold by land under production',
                                            value: 'quantityCertifiedSeedSold_crossCountry'
                                        },
                                        {
                                            label: 'Cross-Country - Number of active seed companies',
                                            value: 'numberActiveCompanies_crossCountry'
                                        },
                                        {
                                            label: 'Cross-Country - Number of varieties sold in data collection year',
                                            value: 'numberVarietiesSold_crossCountry'
                                        },
                                        {
                                            label: 'Cross-Country - Market concentration: Market share of top 4 companies/producers (CR4)',
                                            value: 'marketShareTopFourSeedCompanies_crossCountry'
                                        },
                                        {
                                            label: 'Cross-Country - Market concentration: Herfindahl-Hirschman Index Score',
                                            value: 'marketConcentrationHHI_crossCountry'
                                        },
                                        {
                                            label: 'Cross-Country - Market share of state-owned seed company',
                                            value: 'marketShareStateOwnedSeedCompanies_crossCountry'
                                        },
                                        {
                                            label: 'Cross-Country - Length of variety release process',
                                            value: 'varietyReleaseProcess_crossCountry'
                                        },
                                        {
                                            label: 'Cross-Country - Members overall rating of national seed trade association',
                                            value: 'overallRatingNationalSeedTradeAssociation_crossCountry'
                                        },
                                        {
                                            label: 'Cross-Country - Concentration of agrodealer network',
                                            value: 'agrodealerNetwork_crossCountry'
                                        },
                                        {
                                            label: 'Cross-Country - Availability of seed in small packages (2kg)',
                                            value: 'availabilitySeedSmallPackages_crossCountry'
                                        },
                                        {
                                            label: 'Cross-Country - Concentration of agricultural extension services for smallholder farmers',
                                            value: 'agriculturalExtensionServices_crossCountry'
                                        }
                                    ]}
                                />
                            </PanelRow>
                            <PanelRow>
                                <ToggleControl
                                    label={__("Download chart")}
                                    checked={download}
                                    onChange={(download) => setAttributes({ download })}
                                />
                            </PanelRow>
                            {type === 'availabilityOfBasicSeed' && <PanelRow>
                                <RangeControl
                                    label={__('Max number years to show')}
                                    value={mostRecentYears}
                                    onChange={(mostRecentYears) => setAttributes({ mostRecentYears })}
                                    min={1}
                                    max={10}
                                /></PanelRow>}
                            {/*TODO commenting out the code since to enable the change in the different charts adjustemnets to the code
                             TODO needs to be done out of the scope of the current stage
                          (type==='numberActiveBreeders' ||type==='varietiesReleasedWithSpecialFeatures' )&&
                            <PanelRow>
                              <SelectControl
                                label={__('Layout:')}
                                value={[layout]}
                                onChange={(layout) => {
                                  setAttributes({ layout })
                                }}
                                options={[
                                  {
                                    label: 'Horizontal',
                                    value: 'horizontal'
                                  },
                                  {
                                    label: 'Vertical',
                                    value: 'vertical'
                                  }

                                ]}
                              />
                          </PanelRow>*/}
                            {/*TODO commenting out the code since to enable the change in the different charts adjustemnets to the code
                          needs to be done out of the scope of the current stage
                              (type==='numberActiveBreeders' ||type==='varietiesReleasedWithSpecialFeatures' )&&
                            <PanelRow>
                            <SelectControl
                              label={__('Group mode:')}
                              value={[groupMode]}
                              onChange={(groupMode) => {
                                setAttributes({ groupMode })
                              }}
                              options={[
                                {
                                  label: 'Stacked',
                                  value: 'stacked'
                                },
                                {
                                  label: 'Grouped',
                                  value: 'grouped'
                                }

                              ]}
                            /></PanelRow>*/
                            }<PanelRow>
                            <RangeControl
                                label={__('Chart Width')}
                                value={width}
                                onChange={(width) => setAttributes({ width })}
                                min={1}
                                max={1000}
                            /></PanelRow>
                            <PanelRow>
                                <RangeControl
                                    label={__('Chart height')}
                                    value={height}
                                    onChange={(height) => setAttributes({ height })}
                                    min={1}
                                    max={1000}
                                /></PanelRow>
                            <PanelRow>
                                <TextControl label={__('Default country ID')} value={defaultCountryId}
                                             onChange={(defaultCountryId) => setAttributes({ defaultCountryId })} />
                            </PanelRow>
                        </PanelBody>
                        {type !== 'countryInfo' &&
                            <GeneralChartsLabels bodyTitle={__('Chart labels configuration')} title={title}
                                                 setAttributes={setAttributes} subTitle={subTitle} sources={sources}
                                                 useSourceByCategory={useSourceByCategory} methodology={methodology} />}
                        {type === 'countryInfo' &&
                            <CountryInfoChartsLabels bodyTitle={__('Country information labels configuration')}
                                                     totalLandArea_en={totalLandArea_en} arableLand_en={arableLand_en}
                                                     arableLand_fr={arableLand_fr}
                                                     setAttributes={setAttributes}
                                                     totalLandAreaUnit_en={totalLandAreaUnit_en}
                                                     totalLandAreaUnit_fr={totalLandAreaUnit_fr}
                                                     topHarvestedCropsAndValue_en={topHarvestedCropsAndValue_en}
                                                     topHarvestedCropsAndValue_fr={topHarvestedCropsAndValue_fr}
                                                     topHarvestedCropsAndValueUnit={topHarvestedCropsAndValueUnit}
                                                     populationVsFarmingHouseholds_en={populationVsFarmingHouseholds_en}
                                                     populationVsFarmingHouseholds_fr={populationVsFarmingHouseholds_fr}
                                                     totalPopulationLabel_en={totalPopulationLabel_en}
                                                     totalPopulationLabel_fr={totalPopulationLabel_fr}
                                                     farmingHouseholdsLabel_en={farmingHouseholdsLabel_en}
                                                     farmingHouseholdsLabel_fr={farmingHouseholdsLabel_fr}
                                                     sourceText_en={sourceText_en} sourceText_fr={sourceText_fr}
                            />}
                    </Panel>
                </InspectorControls>
            ), (
                <ResizableBox
                    size={{ height, width }}
                    style={{ "margin": "auto" }}
                    minHeight="50"
                    minWidth="50"
                    enable={{
                        top: false,
                        right: true,
                        bottom: true,
                        left: false,
                        topRight: false,
                        bottomRight: true,
                        bottomLeft: false,
                        topLeft: false,
                    }}
                    onResizeStop={(event, direction, elt, delta) => {
                        setAttributes({
                            height: parseInt(height + delta.height, 10),
                            width: parseInt(width + delta.width, 10),
                        });
                        toggleSelection(true);
                    }}
                    onResizeStart={() => {
                        toggleSelection(false);
                    }}
                >
                    <div className={className} style={divStyles}>
                        <div>
                            {
                                dualMode &&
                                <Checkbox
                                    toggle
                                    defaultChecked={true}
                                    onChange={e => setAttributes({ mode: (mode == 'chart' ? 'info' : 'chart') })}
                                />
                            }
                        </div>
                        {
                            mode == "chart" &&
                            <div>
                                <iframe id={"id_description_iframe"} scrolling={"no"}
                                        style={divStyles}
                                        src={this.state.react_ui_url + "/en/embeddable/chart?" + queryString} />
                            </div>
                        }
                        {
                            mode == "info" &&
                            <div className={"inner block"}>
                                <InnerBlocks />
                            </div>
                        }
                    </div>
                </ResizableBox>
            )]);
    }
}

const Edit = (props) => {
    const blockProps = useBlockProps();
    return <div {...blockProps}><BlockEdit {...props} /></div>;
}
const CountryInfoChartsLabels = ({
                                     bodyTitle,
                                     totalLandArea_en,
                                     totalLandArea_fr,
                                     setAttributes,
                                     arableLand_en,
                                     arableLand_fr,
                                     totalLandAreaUnit_en,
                                     totalLandAreaUnit_fr,
                                     topHarvestedCropsAndValue_en,
                                     topHarvestedCropsAndValue_fr,
                                     topHarvestedCropsAndValueUnit,
                                     populationVsFarmingHouseholds_en,
                                     populationVsFarmingHouseholds_fr,
                                     totalPopulationLabel_en,
                                     totalPopulationLabel_fr,
                                     farmingHouseholdsLabel_en,
                                     farmingHouseholdsLabel_fr,
                                     sourceText_en,
                                     sourceText_fr,
                                 }) => {
    return (<PanelBody title={__(bodyTitle)}>
        <PanelRow>
            <TextControl label={__('Total land area label in English')} value={totalLandArea_en}
                         onChange={(totalLandArea_en) => setAttributes({ totalLandArea_en })} />
        </PanelRow>
        <PanelRow>
            <TextControl label={__('Total land area label in French')} value={totalLandArea_fr}
                         onChange={(totalLandArea_fr) => setAttributes({ totalLandArea_fr })} />
        </PanelRow>
        
        <PanelRow>
            <TextControl label={__('Total land area unit in English')} value={totalLandAreaUnit_en}
                         onChange={(totalLandAreaUnit_en) => setAttributes({ totalLandAreaUnit_en })} />
        </PanelRow>
        <PanelRow>
            <TextControl label={__('Total land area unit in French')} value={totalLandAreaUnit_fr}
                         onChange={(totalLandAreaUnit_fr) => setAttributes({ totalLandAreaUnit_fr })} />
        </PanelRow>
        
        <PanelRow>
            <TextControl label={__('Arable land label in English')} value={arableLand_en}
                         onChange={(arableLand_en) => setAttributes({ arableLand_en })} />
        </PanelRow>
        <PanelRow>
            <TextControl label={__('Arable land label in French')} value={arableLand_fr}
                         onChange={(arableLand_fr) => setAttributes({ arableLand_fr })} />
        </PanelRow>
        
        <PanelRow>
            <TextControl label={__('Top Harvested Crops and Value label in English')} value={topHarvestedCropsAndValue_en}
                         onChange={(topHarvestedCropsAndValue_en) => setAttributes({ topHarvestedCropsAndValue_en })} />
        </PanelRow>
        <PanelRow>
            <TextControl label={__('Top Harvested Crops and Value label in French')} value={topHarvestedCropsAndValue_fr}
                         onChange={(topHarvestedCropsAndValue_fr) => setAttributes({ topHarvestedCropsAndValue_fr })} />
        </PanelRow>
        
        <PanelRow>
            <TextControl label={__('Top Harvested Crops and Value unit')} value={topHarvestedCropsAndValueUnit}
                         onChange={(topHarvestedCropsAndValueUnit) => setAttributes({ topHarvestedCropsAndValueUnit })} />
        </PanelRow>
        
        <PanelRow>
            <TextControl label={__('Population vs Farming Households label in English')} value={populationVsFarmingHouseholds_en}
                         onChange={(populationVsFarmingHouseholds_en) => setAttributes({ populationVsFarmingHouseholds_en })} />
        </PanelRow>
        <PanelRow>
            <TextControl label={__('Population vs Farming Households label in French')} value={populationVsFarmingHouseholds_fr}
                         onChange={(populationVsFarmingHouseholds_fr) => setAttributes({ populationVsFarmingHouseholds_fr })} />
        </PanelRow>
        
        <PanelRow>
            <TextControl label={__('Total Population label in English')} value={totalPopulationLabel_en}
                         onChange={(totalPopulationLabel_en) => setAttributes({ totalPopulationLabel_en })} />
        </PanelRow>
        <PanelRow>
            <TextControl label={__('Total Population label in French')} value={totalPopulationLabel_fr}
                         onChange={(totalPopulationLabel_fr) => setAttributes({ totalPopulationLabel_fr })} />
        </PanelRow>
        
        <PanelRow>
            <TextControl label={__('Farming Households label in English')} value={farmingHouseholdsLabel_en}
                         onChange={(farmingHouseholdsLabel_en) => setAttributes({ farmingHouseholdsLabel_en })} />
        </PanelRow>
        <PanelRow>
            <TextControl label={__('Farming Households label in French')} value={farmingHouseholdsLabel_fr}
                         onChange={(farmingHouseholdsLabel_fr) => setAttributes({ farmingHouseholdsLabel_fr })} />
        </PanelRow>
        
        <PanelRow>
            <TextareaControl
                label={__('Source in English (it can be HTML)')}
                value={sourceText_en}
                onChange={(sourceText_en) => setAttributes({ sourceText_en })}
            />
        </PanelRow>
        <PanelRow>
            <TextareaControl
                label={__('Source in French (it can be HTML)')}
                value={sourceText_fr}
                onChange={(sourceText_fr) => setAttributes({ sourceText_fr })}
            />
        </PanelRow>
    </PanelBody>)
}
const GeneralChartsLabels = ({
                                 bodyTitle,
                                 title,
                                 setAttributes,
                                 subTitle,
                                 sources,
                                 useSourceByCategory,
                                 methodology
                             }) => {

    return <PanelBody title={__(bodyTitle)}>
        <PanelRow>
            <TextControl label={__('Chart title')} value={title}
                         onChange={(title) => setAttributes({ title })} />
        </PanelRow>

        <PanelRow>
            <TextControl label={__('Chart sub title')} value={subTitle}
                         onChange={(subTitle) => setAttributes({ subTitle })} />
        </PanelRow>
        <PanelRow>
            <TextControl label={__('Source')} value={sources}
                         onChange={(sources) => setAttributes({ sources })} />
        </PanelRow>
        <PanelRow>
            <ToggleControl
                label={__("Add category as source")}
                checked={useSourceByCategory}
                onChange={(useSourceByCategory) => setAttributes({ useSourceByCategory })}
            />
        </PanelRow>
        <PanelRow>
            <TextControl label={__('Methodology')} value={methodology}
                         onChange={(methodology) => setAttributes({ methodology })} />
        </PanelRow>
    </PanelBody>

}

export default Edit;
