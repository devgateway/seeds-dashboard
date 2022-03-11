import {__} from '@wordpress/i18n';
import {registerBlockType} from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";
import Generic from "../icons";

registerBlockType(process.env.BLOCKS_NS + '/sticky',
    {
        title: __('sticky'),
        icon: Generic,
        category: process.env.BLOCKS_CATEGORY,
        apiVersion: 2,
        attributes: {
            type: {
                type: 'String',
                default: "PDF" /* TODO: can this be a constant? */
            },
            showInline: {
                type: 'Boolean',
                default: true
            },
            category: {
                type: "number",
                default: undefined
            },
            noDataText: {
                type: 'string',
                default: 'No documents available'
            },
            documentSlugPostFix: {
              type: "String",
              default: ""
            }
        },
        edit: BlockEdit,
        save: BlockSave,
    }
);
