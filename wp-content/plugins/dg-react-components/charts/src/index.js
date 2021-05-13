import {__} from '@wordpress/i18n';
import {registerBlockType} from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";

registerBlockType('dg-components/chart',
    {
        title: __('Data Chart', 'dg-components'),
        icon: 'admin-site-alt',
        category: 'react-blocks',
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
                default: "seedInspector",
            },
            source: {
                type: 'string',
                default: '',
            },
            bottomLegend: {
                type: 'string',
                default: "Bottom Legends",
            }
            ,
            leftLegend: {
                type: 'string',
                default: "Left Legends",
            },
            scheme: {
                type: 'string',
                default: 'nivo'
            },

            colorBy: {
                type: 'String',
                default: 'index'
            },
            level1: {
                type: 'String',
                default: 'none'
            },

            level2: {
                type: 'String',
                default: 'none'
            },

            level3: {
                type: 'String',
                default: 'none'
            },
            groupMode:{
                type:'String',
                default:'stacked',
            },
            mode:{
                type:'String',
                default:"chart"
            },
            dualMode:{
                type:"Boolean",
                default:false
            }

        }
        ,
        edit: BlockEdit,
        save: BlockSave,
    }
)
;
