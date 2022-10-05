import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";
import { Chart } from '../icons/index.js'

registerBlockType(process.env.BLOCKS_NS + '/map',
    {
        title: __('Indicator Map'),
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
            type: {
                type: 'string',
                default: "indicators_A",
            },
            sources: {
                type: 'String',
                default: ""
            },
            title: {
                type: 'String',
                default: ""
            },
            sourceText_en: {
                type: 'String',
            },
            sourceText_fr: {
                type: 'String',
            },
            download: {
                type: "Boolean",
                default: true
            },
            methodology: {
                type: 'String',
                default: "Methodology not yet defined."
            }
        },
        edit: BlockEdit,
        save: BlockSave,
    }
);
