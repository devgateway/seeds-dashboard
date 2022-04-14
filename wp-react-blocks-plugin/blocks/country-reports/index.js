import {__} from '@wordpress/i18n';
import {registerBlockType} from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";
import Generic from "../icons";

registerBlockType(process.env.BLOCKS_NS + '/country-reports',
    {
        title: __('Country Reports'),
        icon: Generic,
        category: process.env.BLOCKS_CATEGORY,
        apiVersion: 2,
        attributes: {
            description: {
                type: 'String',
                default: ""
            },
            country: {
                type: 'String',
                default: ""
            },
            year: {
                type: "String",
                default: ""
            },
            image: {
                type: "String",
                default: ""
            },
            height: {
                type: 'number',
                default: 500,
            },
            width: {
                type: 'number',
                default: 900,
            },
            categorySufix: {
                type: "String",
                default: ""
            },
        },
        edit: BlockEdit,
        save: BlockSave,
    }
);
