import {__} from '@wordpress/i18n';
import {registerBlockType} from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";
import {Generic} from '../icons'

registerBlockType(process.env.BLOCKS_NS + '/print',
    {
        title: __('Print Button', 'wp-react-lib-components'),
        icon: Generic,
        category: process.env.BLOCKS_CATEGORY,
        attributes: {
            icon: {
                type: 'String',
                default: "image"
            },
            downloadName:{
                type: 'String',
                default: "tasai_chart"
            },
            size:{
                type: 'String',
                default: "large"
            },
            color:{
                type: 'String',
                default: "grey"
            },
            htmlId:{
                type: 'String',
                default: "exportable.chart"
            }
        },
        edit: BlockEdit,
        save: BlockSave,
    }
);