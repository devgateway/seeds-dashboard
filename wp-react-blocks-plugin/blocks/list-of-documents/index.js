import {__} from '@wordpress/i18n';
import {registerBlockType} from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";
import Generic from "../icons";

registerBlockType(process.env.BLOCKS_NS + '/documents-list',
    {
        title: __('List of Documents'),
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
            }
        },
        edit: BlockEdit,
        save: BlockSave,
    }
);
