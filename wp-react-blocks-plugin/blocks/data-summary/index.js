import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";
import Generic from "../icons";

registerBlockType(process.env.BLOCKS_NS + '/data-summary',
    {
        title: __('Data summary'),
        icon: Generic,
        category: process.env.BLOCKS_CATEGORY,
        apiVersion: 2,
        attributes: {
            title: {
                type: 'String',
                default: "Data Summary: Country comparison"
            }, ratingLabel: {
                type: 'String',
                default: "rating"
            }, numberLabel: {
                type: 'String',
                default: "number"
            },
            ratingAlignment: {
                type: 'String',
                default: "right"
            },
            numberAlignment: {
                type: 'String',
                default: "right"
            },
            ratingMinimumFractionDigits: {
                type: 'String',
                default: "0"
            },
            ratingMaximumFractionDigits: {
                type: 'String',
                default: "1"
            },
            numberMinimumFractionDigits: {
                type: 'String',
                default: "0"
            }, numberMaximumFractionDigits: {
                type: 'String',
                default: "1"
            },
        }
        ,
        edit: BlockEdit,
        save: BlockSave,
    }
)
;
