import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";
import Generic from "../icons";

registerBlockType(process.env.BLOCKS_NS + '/back-to-top',
    {
        title: __('Back to top'),
        icon: Generic,
        category: process.env.BLOCKS_CATEGORY,
        apiVersion: 2,
        attributes: {
            behavior: {
                type: 'String',
                default: "smooth"
            },
            label: {
                type: 'String',
                default: "Back To The Top"
            }


        }
        ,
        edit: BlockEdit,
        save: BlockSave,
    }
)
;
