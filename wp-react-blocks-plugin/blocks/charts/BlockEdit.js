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
    ToggleControl
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
                totalLandArea,
                arableLand,
                totalLandAreaUnit,
                topHarvestedCropsAndValue,
                topHarvestedCropsAndValueUnit,
                populationVsFarmingHouseholds,
                totalPopulationLabel,
                farmingHouseholdsLabel
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
        queryString += `&data-total-population-label=${totalPopulationLabel}`;
        queryString += `&data-farming-households-label=${farmingHouseholdsLabel}`

        queryString += `&data-total-land-area-label=${totalLandArea}`;
        queryString += `&data-total-land-area-unit=${totalLandAreaUnit}`;

        queryString += `&data-total-arable-land-label=${arableLand}`;
        queryString += `&data-top-harvested-crops-and-value=${topHarvestedCropsAndValue}`;
        queryString += `&data-top-harvested-crops-and-value-unit=${topHarvestedCropsAndValueUnit}`;
        queryString += `&data-population-vs-farming-households=${populationVsFarmingHouseholds}`;


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
                                            label: 'Number of seed inspectors in most recent data collection year',
                                            value: 'seedInspectorsByCountry',
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
                                                     totalLandArea={totalLandArea} arableLand={arableLand}
                                                     setAttributes={setAttributes}
                                                     totalLandAreaUnit={totalLandAreaUnit}
                                                     topHarvestedCropsAndValue={topHarvestedCropsAndValue}
                                                     topHarvestedCropsAndValueUnit={topHarvestedCropsAndValueUnit}
                                                     populationVsFarmingHouseholds={populationVsFarmingHouseholds}
                                                     totalPopulationLabel={totalPopulationLabel}
                                                     farmingHouseholdsLabel={farmingHouseholdsLabel}
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
                                     totalLandArea,
                                     setAttributes,
                                     arableLand,
                                     totalLandAreaUnit,
                                     topHarvestedCropsAndValue,
                                     topHarvestedCropsAndValueUnit,
                                     populationVsFarmingHouseholds,
                                     totalPopulationLabel,
                                     farmingHouseholdsLabel
                                 }) => {
    return (<PanelBody title={__(bodyTitle)}>
        <PanelRow>
            <TextControl label={__('Total land area label')} value={totalLandArea}
                         onChange={(totalLandArea) => setAttributes({ totalLandArea })} />
        </PanelRow>
        <PanelRow>
            <TextControl label={__('Total land area unit')} value={totalLandAreaUnit}
                         onChange={(totalLandAreaUnit) => setAttributes({ totalLandAreaUnit })} />
        </PanelRow>
        <PanelRow>
            <TextControl label={__('Arable land label')} value={arableLand}
                         onChange={(arableLand) => setAttributes({ arableLand })} />
        </PanelRow>
        <PanelRow>
            <TextControl label={__('Top Harvested Crops and Value label')} value={topHarvestedCropsAndValue}
                         onChange={(topHarvestedCropsAndValue) => setAttributes({ topHarvestedCropsAndValue })} />
        </PanelRow>
        <PanelRow>
            <TextControl label={__('Top Harvested Crops and Value unit')} value={topHarvestedCropsAndValueUnit}
                         onChange={(topHarvestedCropsAndValueUnit) => setAttributes({ topHarvestedCropsAndValueUnit })} />
        </PanelRow>
        <PanelRow>
            <TextControl label={__('Population vs Farming Households label')} value={populationVsFarmingHouseholds}
                         onChange={(populationVsFarmingHouseholds) => setAttributes({ populationVsFarmingHouseholds })} />
        </PanelRow>
        <PanelRow>
            <TextControl label={__('Total Population label')} value={totalPopulationLabel}
                         onChange={(totalPopulationLabel) => setAttributes({ totalPopulationLabel })} />
        </PanelRow>
        <PanelRow>

            <TextControl label={__('Farming Households label')} value={farmingHouseholdsLabel}
                         onChange={(farmingHouseholdsLabel) => setAttributes({ farmingHouseholdsLabel })} />
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
