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
            type: {
                type: 'string',
                default: "indicators_A",
            },
            sources: {
                type: 'String',
                default: ""
            },
            title_en: {
                type: 'String',
                default: ""
            },
            title_fr: {
                type: 'String',
                default: ""
            },
            sourceText_en: {
                type: 'String',
            },
            sourceText_fr: {
                type: 'String',
            }
        },
        edit: BlockEdit,
        save: BlockSave,
    }
);
