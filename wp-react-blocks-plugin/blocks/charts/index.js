import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";
import { Chart } from '../icons/index.js'

registerBlockType(process.env.BLOCKS_NS + '/chart',
    {
        title: __('Data Chart'),
        icon: Chart,
        category: process.env.BLOCKS_CATEGORY,
        apiVersion: 2,
        attributes: {
            height: {
                type: 'number',
                default: 500,
            },
            width: {
                type: 'number',
                default: 900,
            },
            mostRecentYears: {
                type: 'number',
                default: 5,
            },
            type: {
                type: 'string',
                default: "countryInfo",
            },
            dualMode: {
                type: "Boolean",
                default: false
            },
            download: {
                type: "Boolean",
                default: true
            },
            mode: {
                type: 'String',
                default: "chart"
            },
            sources: {
                type: 'String',
                default: ""
            },
            useSourceByCategory: {
                type: 'Boolean',
                default: false
            },
            title: {
                type: 'String',
                default: ""
            },
            subTitle: {
                type: 'String',
                default: ""
            },
            defaultCountryId: {
                type: 'Number',
                default: 23
            },
            layout: {
                type: 'String',
                default: "vertical"
            },
            groupMode: {
                type: 'String',
                default: "stacked"
            },
            methodology: {
                type: 'String',
                default: "Methodology not yet defined."
            },
            totalLandArea: {
                type: "String",
                default: "Total land area"
            },
            totalLandAreaUnit: {
                type: "String",
                default: "Hectares"
            },

            arableLand: {
                type: "string",
                default: "Arable land"
            },
            topHarvestedCropsAndValue: {
                type: "string",
                default: "Top Harvested Crops and Value"
            },
            topHarvestedCropsAndValueUnit: {
                type: "string",
                default: "hectares"
            },
            populationVsFarmingHouseholds: {
                type: "string",
                default: "Population vs Farming Households"
            },
            totalPopulationLabel: {
                type: "string",
                default: "Total Population"
            },
            farmingHouseholdsLabel: {
                type: "string",
                default: "Farming Households"
            }


        },
        edit: BlockEdit,
        save: BlockSave,
    }
);
